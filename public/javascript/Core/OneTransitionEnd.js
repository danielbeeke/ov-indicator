/**
 * Returns the name of the transitionend event.
 * @returns {*}
 */
function whichTransitionEvent() {
  let t,
    el = document.createElement("fakeelement");

  let transitions = {
    "transition": "transitionend",
    "OTransition": "oTransitionEnd",
    "MozTransition": "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

/**
 * Returns the name of the animationend event.
 * @returns {*}
 */

function whichAnimationEvent() {
  let t,
    el = document.createElement("fakeelement");

  let animations = {
    "animation": "animationend",
    "OAnimation": "oAnimationEnd",
    "MozAnimation": "animationend",
    "WebkitAnimation": "webkitAnimationEnd"
  };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
}

let transitionEndType = whichTransitionEvent();

/**
 * Easy attaching on one time callbacks when a css property is transitioned.
 *
 * How to use:
 * element.oneTransitionEnd('opacity', () => { console.log('done') })
 *
 * @param property
 * @param callback
 * @param cssClassName
 * @returns {HTMLElement}
 */
HTMLElement.prototype.oneTransitionEnd = function (property, callback, cssClassName = false) {
  if (transitionEndType) {
    let innerCallback = (event) => {
      if (event.propertyName.substr(-(property.length)) === property && event.target === this) {
        callback();
        this.removeEventListener(transitionEndType, innerCallback);
      }
    };

    this.addEventListener(transitionEndType, innerCallback);
  } else {
    callback();
  }

  if (cssClassName) {
    setTimeout(() => {
      this.classList.add(cssClassName);
    }, 40);
  }

  return this;
};

let animationEndType = whichAnimationEvent();


/**
 * Easy attaching on one time callbacks when a css animation is finished.
 *
 * How to use:
 * element.oneAnimationEnd('opacity', () => { console.log('done') })
 *
 * @param animationName may be a name or a callback that returns a bool.
 * @param callback
 * @param cssClassName
 * @param target
 * @returns {HTMLElement}
 */
HTMLElement.prototype.oneAnimationEnd = function (animationName, callback, cssClassName, target = false) {
  if (animationEndType) {

    let innerCallback = (event) => {
      if ((
        typeof animationName === 'string' && event.animationName === animationName ||
        typeof animationName === 'function' && animationName(event.animationName) === true) &&
        (event.target === this || target && event.target === target)
      ) {
        callback();
        this.removeEventListener(animationEndType, innerCallback);
      }
    };

    this.addEventListener(animationEndType, innerCallback);
  } else {
    callback();
  }

  if (cssClassName) {
    setTimeout(() => {
      this.classList.add(cssClassName);

      let oldCallback = callback;
      callback = () => {
        this.classList.remove(cssClassName);
        oldCallback();
      }
    }, 40);
  }

  return this;
};