<template>
    <div class="userRegistration">
        <form>
             <label for="email">Email</label>
            <input type="text" name="email" id="email">

            <label for="password">Password</label>
            <input type="password" name="password" id="password">

            <label for="password">Confirm Password</label>
            <input type="password" name="passwordConfirm" id="passwordConfirm">
            
            <div class="buttons">
                <button class="registerButton">Register</button>
            </div>
        </form>
    </div>
</template>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    width: 15rem;
    border: 1px grey solid;
    border-radius: 5px;
    padding: 2rem;
}

input {
    padding: 0.2rem;
}

.buttons {
    display: flex;
    justify-content: center;
}

button {
    background-color: hsla(160, 100%, 37%, 1);
    width: 5rem;
    height: 1.8rem;
    border: none;
    border-radius: 2px;
    margin: 0.8rem 0.6rem;
    padding: 0.3rem;
}

.loginButton {
    background-color: rgb(163, 168, 170);
}
</style>