
    


        async function registerClient() {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Password:', password);
    
            try {
                const response = await fetch('/registerClient', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        name: name,
                        email: email,
                        password: password
                    })
                });
        
                if (!response.ok) {
                    throw new Error("Registration failed. Please try again.");
                }
                const resp = await response.json();
                console.log('Received: ', resp); // Log the JSON data
            } catch (error) {
                // Handle any network or server errors
                console.error('Error during registration:', error);
                alert('Registration failed due to server error. Please try again later.');
            }

            const cardNumberInputs = document.getElementById('cardNumber').value;
            const paymentAddressInputs = document.getElementById('paymentAddress').value;
           
            const cardNumbers = cardNumberInputs.split(',').map(entry => entry.trim());
            const paymentAddresses = paymentAddressInputs.split(',').map(entry => entry.trim());;

            for (let i = 0; i < cardNumbers.length; i++) {
                const cardNumber = cardNumbers[i];
                const paymentAddress = paymentAddresses[i];


                console.log('Card Number:', cardNumber);
                console.log('Payment Address:', paymentAddress);

                try {
                    const response = await fetch('/registerClientPayment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            email: email,
                            cardNumber: cardNumber,
                            paymentAddress: paymentAddress
                        })
                    });
            
                    if (!response.ok) {
                        throw new Error("Registration failed. Please try again.");
                    }
                    const resp = await response.json();
                    console.log('Received: ', resp); // Log the JSON data
                } catch (error) {
                    // Handle any network or server errors
                    console.error('Error during registration:', error);
                    alert('Registration failed due to server error. Please try again later.');
                }
            
        
            }   
        }
        
        async function updateClient() {
            const email = document.getElementById('email-info').value;
            const name = document.getElementById('update-name').value;
            const oldCreditCardNumber = document.getElementById('old-credit-card-number').value;
            const newCreditCardNumber = document.getElementById('update-credit-card-number').value;
            const newPaymentAddress = document.getElementById('update-payment-address').value;

            const cardNumbers = newCreditCardNumber.split(',').map(entry => entry.trim());
            const paymentAddresses = newPaymentAddress.split(',').map(entry => entry.trim());;

            // try {
            //     const response = await fetch('/updateClient', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json'
            //         },
            //         body: JSON.stringify({ 
            //             email: email,
            //             name: name
                        
            //         })
            //     });
            //     if (!response.ok) {
            //         throw new Error("Registration failed. Please try again.");
            //     }
            //     const resp = await response.json();
            //     console.log('Received: ', resp); // Log the JSON data
            //     alert();
            // } catch (error) {
            //     // Handle any network or server errors
            //     console.error('Error during registration:', error);
            //     alert('Registration failed due to server error. Please try again later.');
            // }


            for (let i = 0; i < cardNumbers.length; i++) {
                const cardnumber = cardNumbers[i];
                const paymentAddress = paymentAddresses[i];

                try {
                    console.log('Sending update request with', { email, oldCreditCardNumber, cardnumber, paymentaddress });
                    const response = await fetch('/updateClientPayment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ 
                            clientemail: email,
                            oldCreditCardNumber: oldCreditCardNumber,
                            cardnumber: cardnumber,
                            paymentaddress: paymentAddress

                        })
                    });
            
                    if (!response.ok) {
                        throw new Error("Registration failed. Please try again.");
                    }
                    const resp = await response.json();
                    console.log('Received: ', resp); // Log the JSON data
                } catch (error) {
                    // Handle any network or server errors
                    console.error('Error during registration:', error);
                    alert('Registration failed due to server error. Please try again later.');
                }


            }


        }


            document.addEventListener('DOMContentLoaded', function() {
                //registerClient();

            });