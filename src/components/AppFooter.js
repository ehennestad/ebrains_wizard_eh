function AppFooter() {
  return(
    <footer className="app-footer footer">
    <div className="container-footer">
    <div className="pull-left">
        <p className="text-muted">Copyright © {new Date().getFullYear()} EBRAINS. All rights reserved.</p>
    </div>
    <div className="pull-right">
        <p className="text-muted"> 
        <a href="https://github.com/HumanBrainProject/ebrains_wizard/issues/new" target="_blank" rel="noreferrer">Report issue (Github)</a> 
        &nbsp;|&nbsp;
        <a href="mailto:curation-support@ebrains.eu?subject=Metadata Wizard Issue : <Enter short description here>&body=Dear Curation Team,%0D%0A%0D%0A%0D%0A">Report issue (Email)</a> 
        </p>
    </div>
    </div>
    </footer>
  )
}

export default AppFooter;