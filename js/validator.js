// Validator object constructor
function Validator(options) {
    var selectorRules = {};
    // validate function
    var formElement = document.querySelector(options.form);
    function validate(inputElement, rule) {
        var formGroup = inputElement.closest(options.formGroupSelector);
        var formMessage = formGroup.querySelector(options.errorSelector);
        var errorMessage;
        // run rule test and check error message
        var rules = selectorRules[rule.selector];
        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }
        formMessage.innerText = errorMessage;
        if (errorMessage) {
            formGroup.classList.add('invalid');
        }
        else {
            formGroup.classList.remove('invalid');
        }
        return Boolean(errorMessage);
    }
    // handle submit event and return data
    if (formElement) {
        formElement.onsubmit = (e) => {
            e.preventDefault();
            var isFormValid = true;
            // validate all input elements
            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector);
                var isError = validate(inputElement, rule);
                if (isError) isFormValid = false;
            });
            if (isFormValid) {
                // submit form with javascript
                if (typeof options.onSubmit === 'function') {
                    var inputs = formElement.querySelectorAll('[name]:not([disabled])');
                    var formVales = Array.from(inputs).reduce((values, input) => {
                        switch (input.type) {
                            case 'checkbox':
                                if (input.checked) {
                                    if (!Array.isArray(values[input.name])) {
                                        values[input.name] = [];
                                    }
                                    values[input.name].push(input.value);
                                }
                                else if (!values[input.name]) {
                                    values[input.name] = '';
                                }
                                break;
                            case 'radio':
                                if (input.checked) {
                                    values[input.name] = input.value;
                                }
                                else if (!values[input.name]) {
                                    values[input.name] = '';
                                }
                                break;
                            case 'file':
                                if(input.files.length) {
                                    values[input.name] = input.files[0];
                                }
                                else {
                                    values[input.name] = '';
                                }
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    }, {});
                    options.onSubmit(formVales);
                }
                // submit form with html
                else {
                    formElement.submit();
                }
            }
        }
        // check all input elements
        options.rules.forEach(rule => {
            // save rule for each input
            if (!Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector] = [rule.test];
            }
            else {
                selectorRules[rule.selector].push(rule.test);
            }
            // handle event on all input elements
            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(inputElement => {
                // check when blur event
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                }
                // check when input event
                inputElement.oninput = () => {
                    var formGroup = inputElement.closest(options.formGroupSelector);
                    var formMessage = formGroup.querySelector(options.errorSelector);
                    formMessage.innerText = '';
                    formGroup.classList.remove('invalid');
                }
            });
        });
    }
}

// function of rules to validate

Validator.isRequired = (selector, message = `Vui l??ng nh???p ph???n n??y!`) => {
    return {
        selector,
        test(value) {
            if(typeof value == 'string') value = value.trim();
            return value ? '' : message;
        }
    }
}

Validator.isEmail = (selector, message = 'Email nh???p v??o kh??ng h???p l???!') => {
    return {
        selector,
        test(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? '' : message;
        }
    }
}

Validator.minLength = (selector, min, message = `Vui l??ng nh???p t???i thi???u ${min} k?? t???!`) => {
    return {
        selector,
        test(value) {
            return value.length >= min ? '' : message;
        }
    }
}

Validator.maxLength = (selector, max, message = `Vui l??ng nh???p t???i ??a ${max} k?? t???!`) => {
    return {
        selector,
        test(value) {
            return value.length <= max ? '' : message;
        }
    }
}

Validator.isConfirmed = (selector, selectorConfirm, message = `Th??ng tin nh???p l???i kh??ng kh???p!`) => {
    return {
        selector,
        test(value) {
            var confirmValue = document.querySelector(selectorConfirm).value;
            return value == confirmValue ? '' : message;
        }
    }
}