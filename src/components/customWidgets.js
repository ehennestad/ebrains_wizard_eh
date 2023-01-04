
export const ImageWidget = function(props){
  return (
    <div style={{"margin":"auto","padding":"auto","width":"85%","overflow":"hidden","marginTop":-30}}>
      <img src={props.schema.src} alt={props.schema.alt} width="100%"></img>
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