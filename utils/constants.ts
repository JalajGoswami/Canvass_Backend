export const VerificationMailTemplate = (code: number) => ({
    text: 'Thank you for enrolling 😊\n\n' +
        'Your Verification Code : ' + code + '\n'
        + 'Paste this in the app to Proceed the Signup process.',

    html: '<h3>Thank you for enrolling 😊</h3>'
        + '<br/>' + '<h4>Your Verification Code : '
        + '<b>' + code + '</b></h4>'
        + '<p>Paste this in the app to Proceed the Signup process.</p>'
})