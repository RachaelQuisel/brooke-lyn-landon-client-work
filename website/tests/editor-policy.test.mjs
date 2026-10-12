import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isEditor, isSameOrigin, validateEdits, detectImageType, readLimitedBody, applyValues } from '../lib/editor-policy.mjs';

const fields = new Map([
  ['home.heading.0', {value:'Little stories.'}],
  ['images.brookeSage.src', {value:'',kind:'image'}],
  ['email', {value:'[email]',kind:'email'}],
  ['bookPurchaseUrl', {value:'[book purchase URL]',kind:'url'}],
]);
test('Brooke and the owner can edit; other viewers cannot', () => {
  const allowed = ['owner@example.test', 'brooke@example.test'];
  assert.equal(isEditor({userId:'brooke',email:'brooke@example.test'},allowed),true);
  assert.equal(isEditor({userId:'owner',email:'OWNER@example.test'},allowed),true);
  assert.equal(isEditor({userId:'other',email:'viewer@example.test'},allowed),false);
  assert.equal(isEditor({email:'brooke@example.test'},allowed),false);
  assert.equal(isEditor(null,allowed),false);
});
test('writes require the same origin', () => {
  const request = origin => new Request('https://example.test/api/editor/content',{method:'POST',headers:origin?{origin}:{}});
  assert.equal(isSameOrigin(request('https://example.test')),true);
  assert.equal(isSameOrigin(request('https://evil.test')),false);
  assert.equal(isSameOrigin(request()),false);
});
test('valid edits preserve text and uploaded image references', () => {
  const payload={revision:0,values:{'home.heading.0':'A new story.','images.brookeSage.src':'/media/71206a31-f883-4a63-967b-e0f53595f371.jpg'}};
  assert.deepEqual(validateEdits(payload,fields),payload);
});
test('unknown paths, invalid types, and unsafe links are rejected', () => {
  for(const values of [ {'__proto__.polluted':'yes'}, {'home.heading.0':{html:'bad'}}, {'home.heading.0':'x'.repeat(12001)}, {'images.brookeSage.src':'https://evil.test/photo.svg'}, {'bookPurchaseUrl':'javascript:alert(1)'}, {'email':'not an email'} ]) {
    assert.throws(()=>validateEdits({revision:0,values},fields));
  }
  assert.throws(()=>validateEdits({revision:-1,values:{}},fields));
});
test('photo validation uses actual bytes and rejects HTML and SVG', async () => {
  const png=await readFile(new URL('../public/images/og-placeholder.png',import.meta.url));
  assert.equal(detectImageType(png)?.mime,'image/png');
  assert.equal(detectImageType(Buffer.from('<html>not a photo</html>')),null);
  assert.equal(detectImageType(Buffer.from('<svg onload="alert(1)"></svg>')),null);
  assert.equal(detectImageType(png.subarray(0,12)),null);
});
test('streamed requests cannot bypass the size limit', async () => {
  const small=new Request('https://example.test',{method:'POST',body:'hello'});
  assert.equal(new TextDecoder().decode(await readLimitedBody(small,5)),'hello');
  const large=new Request('https://example.test',{method:'POST',body:'too much'});
  await assert.rejects(()=>readLimitedBody(large,5),error=>error.status===413);
});
test('saved text updates nested and shared content without changing defaults', () => {
  const original={home:{heading:['Original']},sessions:[{phrase:'Original phrase'}]};
  const edited=applyValues(original,{'home.heading.0':'New','sessions.0.phrase':'New phrase'});
  assert.equal(edited.home.heading[0],'New');
  assert.equal(edited.sessions[0].phrase,'New phrase');
  assert.equal(original.home.heading[0],'Original');
});
