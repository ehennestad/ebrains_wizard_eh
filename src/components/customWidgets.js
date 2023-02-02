
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

const CustomArraySchemaField = function(props) {
  const { index, registry } = props;
  const { SchemaField } = registry.fields;
  //const name = `Entry ${index+1}`;
  //const name = props.name.replace(/-(\d+)/g, (match, number) => ` ${Number(number) + 1}`);
  //const name = `${props.schema._name} ${index+1}`
  const name = '';
  return <SchemaField {...props} name={name} />;
};

export const CustomArrayField = {
  ArraySchemaField: CustomArraySchemaField
};