
export const ImageWidget = function(props){
  return (
    <div style={{"margin":"auto","width":"80%","overflow":"hidden","marginTop":-30}}>
      <img src={props.schema.src} alt={props.schema.alt} width={props.schema.width}></img>
      <div style={props.schema.style} dangerouslySetInnerHTML={{__html:props.schema.citation}}/>
    </div>
  )
}

export const RichTextWidget = function(props){ 
  return (
    <div style={props.schema.style} dangerouslySetInnerHTML={{__html:props.schema.text}}/>
  )
}

export default RichTextWidget;