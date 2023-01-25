import React, { Component } from "react";

class TabsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: this.props.selected || 0
    };
  }
  renderTab(index) {
    this.setState({
      selected: index
    });
  }

  renderMenu() {
    const panels = this.props.children;
    return panels.map((elem, index) => {
      let selectedStyle = index === this.state.selected ? " selected" : " ";
      let icon = elem.props.icon;
      let display = elem.props.hide;
      return display ? null : (
        <li
          key={index}
          className={"tab button location primary-button" + selectedStyle}
          onClick={() => this.renderTab(index)}
        >
          <span> {elem.props.title}</span>
          {icon ? <i className={icon + " tab__icon"} /> : null}
        </li>
      );
    });
  }

  getSubtitle() {
    const subtitle = this.props.children[this.state.selected].props.subtitle;
    if (!subtitle) return null;

    return <h2 className="subtitle">{subtitle}</h2>;
  }

  render() {
    return (
      <div>
        <ul className="tabs">{this.renderMenu()}</ul>
        <div className="tab__content">
          {this.getSubtitle()}
          {this.props.children[this.state.selected]}
        </div>
      </div>
    );
  }
}

export default TabsPanel;
