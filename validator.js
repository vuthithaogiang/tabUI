
//constructor
function Validator(options) {
    function getParent(element, selector) {

        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {

                return element.parentElement;
            }

            element = element.parentElement;

        }

    }

    var selectorRules = {};

    //console.log(options.rules);

    function validate(inputElement, rule) {

        var errorMessage; // = rule.test(inputElement.value);

        //console.log(errorMessage);

        // Exspect: spanElement = getParent (inputElement, '.form-group')
        var spanErrorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);

        //lay ra cac rules ua selector 
        var rules = selectorRules[rule.selector];
        //console.log(rules);


        //lap qua tunwg rule va check luon
        // neu co loi thi dung viec kiem tra
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );


                    break;

                default:
                    errorMessage = rules[i](inputElement.value);

            }

            if (errorMessage) {
                break; // khi co loi thoat luon
            }

        }


        if (errorMessage) {
            //lay the cha cua input (div) => lay the con span
            //console.log(inputElement.parentElement.querySelector('.form-message'));

            //var spanErrorElement = inputElement.parentElement.querySelector(".form-message");
            console.log(spanErrorElement);


            spanErrorElement.innerText = errorMessage;

            //add red color for active 
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');

        } else {
            spanErrorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');

        }

        return !errorMessage;

    }

    //lay element cua form can validate 
    var formElement = document.querySelector(options.form);

    console.log(formElement);




    if (formElement) {
        //xu li su kien submit
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // lap qua tung rule  & validate luon

            options.rules.forEach(function (rule) {

                var inputElement = formElement.querySelector(rule.selector);


                var isValid = validate(inputElement, rule);

                if (!isValid) {

                    isFormValid = false;
                }


            });




            if (isFormValid) {
                console.log('Khong co loi');

                //case: submit voi javascript
                if (typeof options.onSubmit === 'function') {

                    //select all fields:  attributes la name va khong cos attribute la disable
                    var enableInputs = formElement.querySelectorAll('[name]:not([disable])');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {

                        switch (input.type) {
                            case 'radio':

                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;

                            case 'checkbox':
                                if(!input.matches(':checked')) return values;

                            
                                if(!Array.isArray(values[input.name]) ) {
                                    values[input.name] = [];
                                }


                                // luon luon la array

                                values[input.name].push(input.value);
                                break;

                            case 'file':
                                values[input.name] = input.files;
                                break;

                            default:
                                values[input.name] = input.value;

                        }

                        return values;

                    }, {});

                    options.onSubmit(formValues);
                }
                //case: submit voi fowm mac dinhj cua trinh duyet
                else {

                    formElement.submit();

                }

            }
            else {
                console.log('co loi!');
            }
        }

        //lap qua moi rules va xu li tung rule: xu lis event: blur, oninput ....
        options.rules.forEach(function (rule) {
            //luu lai tat ca cac rules cho moi input

            if (Array.isArray(selectorRules[rule.selector])) {

                selectorRules[rule.selector].push(rule.test);

            }

            else {
                selectorRules[rule.selector] = [rule.test];
            }


            console.log(rule.selector);
            console.log(formElement.querySelector(rule.selector));

            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(function (inputElement) {

                if (inputElement) {

                    // khi user blur ra ngoai
                    inputElement.onblur = function () {
                        validate(inputElement, rule);
                    }

                    // khi user nhap vao input
                    inputElement.oninput = function () {
                        console.log(inputElement.value);

                        if (inputElement.value.trim() !== '') {
                            console.log('enter name successfully!');
                            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                            //console.log(inputElement.parentElement.querySelector(options.errorSelector).innerText);
                            getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector).innerText = '';

                        }
                    }


                }
            });

        });

        console.log(selectorRules);

    }


}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Vui long nhap vao truong nay!';

        }
    };

}


Validator.isEmail = function (selector, message) {

    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Vui long nhap lai email!';

        }
    };

}

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui long nhap toi thieu ${min} ki tu!`;
        }
    }
}

Validator.isConfirmPassword = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Vui long nhap lai password!';

            // neu value bang cofirm value thi khong co loi
        }
    }

}

// output
Validator({
    form: '#form-1',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#fullname', 'Ten day du nhap vao khong chinh xac!'),
        Validator.isRequired('#email'),
        Validator.isEmail('#email', 'Email nhap vao khong chinh xac!'),
        Validator.minLength('#password', 6, 'Password nhap vao khong chinh xac!'),
        Validator.isRequired('#confirm-password'),
        Validator.isConfirmPassword('#confirm-password', function () {
            return document.querySelector('#form-1 #password').value;
        }, 'Password nhap lai khong chinh xac!'),
        Validator.isRequired('input[name="gender"]'),
        Validator.isRequired('#province'),
        Validator.isRequired('#avatar'),

    ],
    onSubmit: function (data) {
        console.log(data);

    },


});