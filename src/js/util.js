// Utility functions.

(function(global) {

  global.util = {
    fullpageForm: fullpageForm,
    isElement: isElement
  };

  /**
   * Creates a full-page form with the given content and calls the given
   * callback with an object array containing the IDs, values, and checked
   * states of any input elements, then removes the form.
   * @param { string | object } message - The string or Node representing the form's message.
   * @param { string | object } inputs - A string or Node representing the form's inputs.
   * @param { submitCB } submitCB - The form submit callback.
   * @param { cancelCB } [cancelCB] - The form cancel callback.
   */
  function fullpageForm(message, inputs, submitCB, cancelCB) {
    // Verify the arguments.

    if (typeof message !== 'string' && !isElement(message)) {
      throw new TypeError('Form message must be a String or DOM Element.');
    }

    if (typeof inputs !== 'string' && !isElement(inputs)) {
      throw new TypeError('Form inputs must be a String or DOM Element.');
    }

    /*jshint eqnull:true */
    if (typeof submitCB !== 'function' ||
        (cancelCB != null && typeof cancelCB !== 'function')) {
      throw new TypeError('Form callbacks must be functions (or optionally undefined in the case of the cancel callback).');
    }


    // Create the form.

    var formElem = document.createElement('form');
    formElem.classList.add('util-fullpage-form');

    var overlayParentElem = document.createElement('div');
    overlayParentElem.classList.add('util-fullpage-form-overlay');
    overlayParentElem.appendChild(formElem);

    // Add the message.
    if (typeof message === 'string') {
      formElem.innerHTML = message;
    } else {
      formElem.appendChild(message);
    }

    // Add the inputs.
    var inputsContainerElem = document.createElement('div');

    if (typeof inputs === 'string') {
      inputsContainerElem.innerHTML += inputs;
    } else {
      inputsContainerElem.appendChild(inputs);
    }

    formElem.appendChild(inputsContainerElem);

    // Add the standard confirm and cancel buttons.
    var controlsContainerElem = document.createElement('div'),
        confirmBtnElem = document.createElement('button'),
        cancelBtnElem = document.createElement('button');

    confirmBtnElem.type = 'button';
    cancelBtnElem.type = 'button';
    confirmBtnElem.onclick = submit;
    cancelBtnElem.onclick = cancel;
    confirmBtnElem.textContent = 'Confirm';
    cancelBtnElem.textContent = 'Cancel';

    controlsContainerElem.appendChild(cancelBtnElem);
    controlsContainerElem.appendChild(confirmBtnElem);
    formElem.appendChild(controlsContainerElem);

    // Add the default styles.
    overlayParentElem.style.position = 'fixed';
    overlayParentElem.style.top = '0';
    overlayParentElem.style.left = '0';
    overlayParentElem.style.bottom = '0';
    overlayParentElem.style.right = '0';
    overlayParentElem.style.background = 'rgba(0,0,0,0.5)';
    overlayParentElem.style.padding = '10px';
    overlayParentElem.style.display = 'flex';
    overlayParentElem.style['justify-content'] = 'center';
    overlayParentElem.style['align-items'] = 'center';
    overlayParentElem.style['flex-direction'] = 'column';
    overlayParentElem.style['text-align'] = 'center';
    overlayParentElem.style['z-index'] = '999';

    formElem.style.background = 'white';
    formElem.style.border = 'solid 1px black';
    formElem.style.color = 'black';
    formElem.style.padding = '10px';
    formElem.style['max-height'] = '100%';
    formElem.style['overflow-y'] = 'scroll';

    controlsContainerElem.style['margin-top'] = '15px';

    cancelBtnElem.style['margin-right'] = '10px';

    // Add the form to the document body.
    document.body.appendChild(overlayParentElem);

    function cancel() {
      // If a cancel callback was passed, call it with the inputs' values.
      if (cancelCB) {
        cancelCB(getInputData(inputsContainerElem));
      }

      remove();
    }

    function getInputData(elem) {
      var results = [];

      if (elem.tagName.toLowerCase() === 'input') {
        var result = {
          id: elem.id,
          value: elem.value,
          checked: elem.checked
        };

        results.push(result);
      } else if (elem.children.length) {
        for (var i = 0, len = elem.children.length; i < len; i++) {
          results = results.concat(getInputData(elem.children[i]));
        }
      }

      return results;
    }

    function remove() {
      document.body.removeChild(overlayParentElem);
      overlayParentElem = null;
      formElem = null;
      controlsContainerElem = null;
      confirmBtnElem = null;
      cancelBtnElem = null;
    }

    function submit() {
      // Call the submit callback with the inputs' values.
      submitCB(getInputData(inputsContainerElem));

      remove();
    }
  }

  /**
   * Returns true if o is a DOM element. (Credit: http://stackoverflow.com/a/384380)
   */
  function isElement(o){
    return typeof HTMLElement === "object" ?
             o instanceof HTMLElement : //DOM2
             o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string";
  }

})(this);
