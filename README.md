# form-validate

Form validate with js (2 ways), see the example below

+ https://www.ltp110.tk/form-validate/index
+ https://www.ltp110.tk/form-validate/index2



## Not All Solutions are Equal

Input validation is an important layer of security that all production-level applications should have. However, no matter how ‘perfect’ your input validation is for your specific use case, there simply are limitations to all kinds of security implementations - and input validation is not exempt from it.

You cannot make your application fully XSS-proof through input validation alone. Controls may be put in place at the input level that may lessen the attack surface of the application, but it doesn’t fully remediate it. Full remediation of an XSS vulnerability in your application requires additional layers of defenses, such as mitigation on the browser-level (via secure cookies, content-security-policy headers, etc.) and escaping and purifying user-provided input.
