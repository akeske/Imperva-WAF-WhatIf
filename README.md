## Imperva Web Application Firewall (WAF) | Security Rules What If

This project was created to simulate a user with specific characteristics and which security rule from Imperva WAF will be triggered.

The idea is from Microsoft AAD Conditional Access What if and powershell WhatIf function.

### How to

Execute `npm i`, `ng serve`, navigate `http://localhost:4200/`, and play.

![Two containers of whatif and results](https://raw.githubusercontent.com/akeske/Imperva-WAF-WhatIf/main/images/image1.png)
![Results per rule](https://raw.githubusercontent.com/akeske/Imperva-WAF-WhatIf/main/images/image2.png)

### Edit the rules

Edit `src/app/rules.ts` and add your rules

### Parenthesis matters

> true & false & true & true & true | true & true & true & true & true & true & true = **true**

> (true & false & true & true) & (true | (true & true & true & true & true)) = **false**

### Example of how ';' bahaves

```plaintext
ClientIP != 62.169.201.60;109.242.233.139
    allow from 109.242.233.139
    true & false = false
    block from out
    true & true = true

ClientIP != 62.169.201.60 & ClientIP != 109.242.233.139
    allow from 109.242.233.139
    true & false = false
    block from out
    true & true = true
```

```plaintext
ClientIP == 62.169.201.60;109.242.233.139
    block from these ips
    false | true = true
    allow from out
    false | false = false

ClientIP == 62.169.201.60 | ClientIP == 109.242.233.139
    block from these ips
    false | true = true
    allow from out
    false | false = false
```
