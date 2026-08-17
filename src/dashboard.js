const userName = document.getElementById('userName');

const balance = document.getElementById('balance');

const sendMoneyBtn = document.getElementById('sendMoneyBtn');

const sendForm = document.getElementById('sendForm');

const submitTransaction =

    document.getElementById('submitTransaction');

const transactionMessage =

    document.getElementById('transactionMessage');

const receipt =

    document.getElementById('receipt');

const receiptContent =

    document.getElementById('receiptContent');

const transactionList =

    document.getElementById('transactionList');

const logoutBtn =

    document.getElementById('logoutBtn');

const token = localStorage.getItem('token');

/*

    Protect dashboard

*/

if (!token) {

    window.location.href = 'index.html';

}

/*

    Get user information

*/

async function getUser() {

    try {

        const response = await fetch(

            'https://transcation-wallet-spa-backend.vercel.app/user/me',

            {

                headers: {

                    'Authorization': `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if (!response.ok) {

            localStorage.removeItem('token');

            window.location.href = 'index.html';

            return;

        }

        userName.textContent =

            data.user.name;

        balance.textContent =

            `$${Number(data.user.balance).toLocaleString()}`;

    } catch (error) {

        console.error(error);

    }

}

/*

    Get transaction history

*/

async function getTransactions() {

    try {

        const response = await fetch(

            'https://transcation-wallet-spa-backend.vercel.app/transaction',

            {

                headers: {

                    'Authorization': `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if (!response.ok) {

            transactionList.innerHTML =

                '<p>Unable to load transactions.</p>';

            return;

        }

        if (data.transactions.length === 0) {

            transactionList.innerHTML =

                '<p class="loading">No transactions yet.</p>';

            return;

        }

        transactionList.innerHTML = '';

        data.transactions.forEach(transaction => {

            const item =

                document.createElement('div');

            item.classList.add('transaction');

            item.innerHTML = `

                <div class="transaction-info">

                    <h3>

                        ${transaction.destination}

                    </h3>

                    <p>

                        ${transaction.recipient_email}

                    </p>

                    <p>

                        ${new Date(

                            transaction.created_at

                        ).toLocaleString()}

                    </p>

                </div>

                <div>

                    <p class="transaction-amount">

                        -$${Number(

                            transaction.amount

                        ).toLocaleString()}

                    </p>

                    <p class="success">

                        ${transaction.status}

                    </p>

                </div>

            `;

            transactionList.appendChild(item);

        });

    } catch (error) {

        console.error(error);

        transactionList.innerHTML =

            '<p>Unable to connect to server.</p>';

    }

}

/*

    Show send-money form

*/

sendMoneyBtn.addEventListener('click', () => {

    sendForm.classList.toggle('hidden');

});

/*

    Send transaction

*/

submitTransaction.addEventListener(

    'click',

    async () => {

        const destination =

            document.getElementById(

                'destination'

            ).value;

        const email =

            document.getElementById(

                'recipientEmail'

            ).value;

        const amount =

            Number(

                document.getElementById(

                    'amount'

                ).value

            );

        if (!email || !amount) {

            transactionMessage.textContent =

                'Please enter an email and amount.';

            return;

        }

        transactionMessage.textContent =

            'Processing transaction...';

        try {

            const response = await fetch(

                'https://transcation-wallet-spa-backend.vercel.app/transaction/send',

                {

                    method: 'POST',

                    headers: {

                        'Content-Type':

                            'application/json',

                        'Authorization':

                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        destination,

                        recipientEmail:

                            email,

                        amount

                    })

                }

            );

            const data =

                await response.json();

            if (!response.ok) {

                transactionMessage.textContent =

                    data.message ||

                    'Transaction failed.';

                return;

            }

            transactionMessage.textContent =

                '';

            /*

                Show receipt

            */

            receipt.classList.remove('hidden');

            receiptContent.innerHTML = `

                <p>

                    <strong>Status:</strong>

                    Successful! Contact your agent for next step

                </p>

                <p>

                    <strong>Destination:</strong>

                    ${data.transaction.destination}

                </p>

                <p>

                    <strong>Recipient:</strong>

                    ${data.transaction.recipient_email}

                </p>

                <p>

                    <strong>Amount:</strong>

                    $${Number(

                        data.transaction.amount

                    ).toLocaleString()}

                </p>

                <p>

                    <strong>Reference:</strong>

                    ${data.transaction.reference}

                </p>

            `;

            /*

                Clear form

            */

            document.getElementById(

                'recipientEmail'

            ).value = '';

            document.getElementById(

                'amount'

            ).value = '';

            /*

                Refresh balance

                and transaction history

            */

            getUser();

            getTransactions();

        } catch (error) {

            console.error(error);

            transactionMessage.textContent =

                'Unable to connect to server.';

        }

    }

);

/*

    Logout

*/

logoutBtn.addEventListener('click', () => {

    localStorage.removeItem('token');

    window.location.href = 'index.html';

});

/*

    Load dashboard

*/

getUser();

getTransactions();