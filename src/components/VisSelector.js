import React from 'react'

class VisSelector extends React.Component {
    state = {attr: ''}

    onSelectChange = event => {
        this.setState({attr: event.target.value}, () => {
            this.props.onAttrChange(this.state.attr)
        })
    }

    render() {
        return (
            <select id="vis-dropdown" className="ui dropdown button" value={this.state.attr} onChange={this.onSelectChange}>
                <option value="">Attributes</option>
                <option value="number">number</option>
                <option value="color">color</option>
                <option value="area">area</option>
            </select>
        )
    }
}

export default VisSelector
