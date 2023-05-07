export const VerificationMailTemplate = (code: string) => ({
    text: 'Thank you for enrolling 😊\n\n' +
        'Your Verification Code : ' + code + '\n'
        + 'Paste this in the app to Proceed the Signup process.',

    html: '<h3>Thank you for enrolling 😊</h3>'
        + '<br/><br/>' + '<p>Your Verification Code : '
        + '<b>' + code + '</b></p>'
        + '<p>Paste this in the app to Proceed the Signup process.</p>'
})