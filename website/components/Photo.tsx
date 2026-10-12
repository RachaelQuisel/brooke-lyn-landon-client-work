type PhotoData={src:string;alt:string;label:string;note:string;status:string};
export default function Photo({image,variant=''}:{image:PhotoData;variant?:string}) { return (
<figure className={`photo-frame ${variant}`} >
  {image.src ? <img src={image.src} alt={image.alt} width="720" height="800" loading="lazy" /> :
    <div className="photo-placeholder">
      <span className="placeholder-cross" aria-hidden="true">+</span>
      <p className="placeholder-title">{image.label}</p>
      <p className="placeholder-note">{image.note}</p>
      <span className="placeholder-status">{image.status}</span>
    </div>
  }
</figure>
); }
