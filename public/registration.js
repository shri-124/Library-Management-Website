
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
                alert('Email registered to given client already exists.');
            }

            const cardNumberInputs = document.getElementById('cardNumber').value;
            const paymentAddressInputs = document.getElementById('paymentAddress').value;
           
            const cardNumbers = cardNumberInputs.split(',').map(entry => entry.trim());
            const paymentAddresses = paymentAddressInputs.split(',').map(entry => entry.trim())

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
        
        // async function updateClient() {
        //     // const email = document.getElementById('email-info').value;
        //     // const name = document.getElementById('update-name').value;
        //     // const oldCreditCardNumber = document.getElementById('old-credit-card-number').value;
        //     // const newCreditCardNumber = document.getElementById('update-credit-card-number').value;
        //     // const newPaymentAddress = document.getElementById('update-payment-address').value;

        //     // // const cardNumbers = newCreditCardNumber.split(',').map(entry => entry.trim());
        //     // // const paymentAddresses = newPaymentAddress.split(',').map(entry => entry.trim());;

        //     // if (oldCreditCardNumber != blank) {
        //     //     access database for creditcard entered and delete that specific credit card.
        //     // }

        //     // if (newCreditCardNumber != blank && newPaymentAddress != blank) {
        //     //     insert new creditcard number and its associated payment method into the database
        //     // }


        //     document.getElementById('updateClientForm').addEventListener('submit', function(event) {
        //         event.preventDefault();  // Prevent the default form submission
            
        //         const email = document.getElementById('email').value;
        //         const name = document.getElementById('name').value;
        //         const oldCreditCardNumber = document.getElementById('oldCreditCardNumber').value;
        //         const newCreditCardNumber = document.getElementById('newCreditCardNumber').value;
        //         const newPaymentAddress = document.getElementById('newPaymentAddress').value;
            
        //         const data = {
        //             email,
        //             name,
        //             oldCreditCardNumber,
        //             newCreditCardNumber,
        //             newPaymentAddress
        //         };
            
        //         fetch('/updateClient', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify(data)
        //         })
        //         .then(response => response.json())
        //         .then(data => {
        //             console.log('Success:', data);
        //             alert('Client information updated successfully!');
        //         })
        //         .catch((error) => {
        //             console.error('Error:', error);
        //             alert('Failed to update client information.');
        //         });
        //     });
            



        //     // try {
        //     //     const response = await fetch('/updateClient', {
        //     //         method: 'POST',
        //     //         headers: {
        //     //             'Content-Type': 'application/json'
        //     //         },
        //     //         body: JSON.stringify({ 
        //     //             email: email,
        //     //             name: name
                        
        //     //         })
        //     //     });
        //     //     if (!response.ok) {
        //     //         throw new Error("Registration failed. Please try again.");
        //     //     }
        //     //     const resp = await response.json();
        //     //     console.log('Received: ', resp); // Log the JSON data
        //     //     alert();
        //     // } catch (error) {
        //     //     // Handle any network or server errors
        //     //     console.error('Error during registration:', error);
        //     //     alert('Registration failed due to server error. Please try again later.');
        //     // }


        //     // for (let i = 0; i < cardNumbers.length; i++) {
        //     //     const cardnumber = cardNumbers[i];
        //     //     const paymentAddress = paymentAddresses[i];

        //     //     try {
        //     //         console.log('Sending update request with', { email, oldCreditCardNumber, cardnumber, paymentaddress });
        //     //         const response = await fetch('/updateClientPayment', {
        //     //             method: 'POST',
        //     //             headers: {
        //     //                 'Content-Type': 'application/json'
        //     //             },
        //     //             body: JSON.stringify({ 
        //     //                 clientemail: email,
        //     //                 oldCreditCardNumber: oldCreditCardNumber,
        //     //                 cardnumber: cardnumber,
        //     //                 paymentaddress: paymentAddress

        //     //             })
        //     //         });
            
        //     //         if (!response.ok) {
        //     //             throw new Error("Registration failed. Please try again.");
        //     //         }
        //     //         const resp = await response.json();
        //     //         console.log('Received: ', resp); // Log the JSON data
        //     //     } catch (error) {
        //     //         // Handle any network or server errors
        //     //         console.error('Error during registration:', error);
        //     //         alert('Registration failed due to server error. Please try again later.');
        //     //     }


        //     // }


        // }


        //     document.addEventListener('DOMContentLoaded', function() {
        //         //registerClient();

        //     });


        async function updateClient() {
            // document.getElementById('updateClientForm').addEventListener('submit', async function(event) {
                // event.preventDefault();  // Prevent the default form submission
        
                const email = document.getElementById('email-info').value;
                const name = document.getElementById('update-name').value;
                const oldCreditCardNumber = document.getElementById('old-credit-card-number').value;
                const newCreditCardNumber = document.getElementById('update-credit-card-number').value;
                const newPaymentAddress = document.getElementById('update-payment-address').value;
                
                console.log(email, name); // This should now log the input correctly.
        
                const data = {
                    email,
                    name,
                    oldCreditCardNumber,
                    newCreditCardNumber,
                    newPaymentAddress
                };
                
                try {
                    const response = await fetch('/updateClient', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
        
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
        
                    const result = await response.json();
                    console.log('Success:', result);
                    alert('Client information updated successfully!');
                } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to update client information. ' + error.message);
                }
            // });
        }


            document.addEventListener('DOMContentLoaded', function() {
                //registerClient();

            });

            async function deleteClient() {
                const email = document.getElementById('delete-client-email').value;
            
                if (!email) {
                    alert("Please provide an email address.");
                    return;
                }
            
                try {
                    const response = await fetch('/delete-client', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    });
            
                    const data = await response.json();
            
                    if (response.ok) {
                        document.getElementById('deleteForm').reset();
                    } else {
                        throw new Error(data.message);
                    }
                } 
                catch (error) {
                    console.error('Failed to delete client:', error);
                    alert('Failed to delete client: ' + error.message);
                }

                try {
                    const response = await fetch('/delete-credit_card', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email:email })
                    });
            
                    const data = await response.json();
            
                    if (response.ok) {
                        
                    } else {
                        throw new Error(data.message);
                    }
                } catch (error) {
                    console.error('Failed to delete client:', error);
                    alert('Failed to delete client: ' + error.message);
                }
            }
            

        
        // document.addEventListener('DOMContentLoaded', function() {
        //     updateClient(); // Ensure the updateClient function is set up after the page has loaded.
        // });
        
