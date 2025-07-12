"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: "premium",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: "standard",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: "premium",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: "basic",
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

// <--!  display Movments -->
const displayMovments = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="movements__value">${mov} €</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// <--! user name  -->
const userNames = function (accs) {
  accs.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
userNames(accounts);

// <--!  display Balance -->
const displayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${+acc.balance}€`;
};

// <--!  display Summary -->
const displaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${+incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${+Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, init) => acc + init, 0);
  labelSumInterest.textContent = `${+interest}€`;
};

// <--! update Ui -->
const updateUi = function (acc) {
  displayMovments(currentAcc);
  displayBalance(currentAcc);
  displaySummary(currentAcc);
};

// <--! Event handler -->

// <--! implementing login -->
let currentAcc;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAcc = accounts.find(
    (acc) => acc.userName === inputLoginUsername.value
  );
  if (currentAcc?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = "100";
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUi(currentAcc);
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

// <--! Implementing Transfers -->
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAcc.balance &&
    receiverAcc?.userName !== currentAcc.userName
  ) {
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUi(currentAcc);
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

// <--! implementing loan -->
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputLoanAmount.value;
  if (amount > 0 && currentAcc.movements.some((mov) => mov >= amount * 0.1)) {
    currentAcc.movements.push(amount);
    updateUi(currentAcc);
  }
  inputLoanAmount.value = "";
});

// <--! delete account -->
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  const accIndex = accounts.findIndex(
    (acc) => acc.userName === inputCloseUsername.value
  );
  if (
    currentAcc?.userName === inputCloseUsername.value &&
    currentAcc?.pin === +inputClosePin.value
  ) {
    accounts.splice(accIndex, 1);
    containerApp.style.opacity = "0";
  }
});

// <--! sort movments -->
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovments(currentAcc, !sorted);
  sorted = !sorted;
});
