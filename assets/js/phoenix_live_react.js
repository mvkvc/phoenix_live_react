import React from "react"
import ReactDOM from "react-dom"

const render = function(el, target, component, additionalProps = {}, previousProps = {}) {
  let props = el.dataset.liveReactProps ? JSON.parse(el.dataset.liveReactProps) : {};
  if (el.dataset.liveReactMerge) {
    props = {...previousProps, ...props, ...additionalProps}
  } else {
    props = {...props, ...additionalProps}
  }
  const reactElement = React.createElement(component, props);
  ReactDOM.render(reactElement, target);
  return props;
}

const initLiveReactElement = function(el, additionalProps) {
  const target = el.nextElementSibling;
  const component = Array.prototype.reduce.call(el.dataset.liveReactClass.split('.'), (acc, el) => { return acc[el] }, window);
  render(el, target, component, additionalProps);
  return { target, component };
}

const initLiveReact = function() {
  const elements = document.querySelectorAll('[data-live-react-class]')
  Array.prototype.forEach.call(elements, el => {
    initLiveReactElement(el)
  });
}

const LiveReact = {
  mounted() {
    const { el } = this;
    const pushEvent = this.pushEvent.bind(this);
    const pushEventTo = this.pushEventTo && this.pushEventTo.bind(this);
    const handleEvent = this.handleEvent && this.handleEvent.bind(this);
    const { target, component } = initLiveReactElement(el, { pushEvent, pushEventTo, handleEvent });
    const props = render(el, target, component, { pushEvent, pushEventTo, handleEvent });
    if (el.dataset.liveReactMerge) this.props = props
    Object.assign(this, { target, component });
  },

  updated() {
    const { el, target, component } = this;
    const pushEvent = this.pushEvent.bind(this);
    const pushEventTo = this.pushEventTo && this.pushEventTo.bind(this);
    const handleEvent = this.handleEvent;
    const previousProps = this.props;
    const props = render(el, target, Component, { pushEvent, pushEventTo }, previousProps);
    if (el.dataset.liveReactMerge) this.props = props;
  },

  destroyed() {
    const { target } = this;
    ReactDOM.unmountComponentAtNode(target);
  }
}

export { LiveReact as default, initLiveReact, initLiveReactElement };
