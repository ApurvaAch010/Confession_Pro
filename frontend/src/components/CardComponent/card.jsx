import "./card.css";

const CardComponent=({confessTitle,confessContent,pictureComponent:Picture,pictureColor,classNam})=>{
    return(
    
    <div className="cards">
      <div className={classNam}>
        <div className="card-left">
          <Picture size={30} color={pictureColor} />
        </div>
        <div className="card-right">
          <h1 className="title">{confessTitle}</h1>
          <p className="content">{confessContent}</p>
        </div>
      </div>
    </div>
    )
}
export default CardComponent;