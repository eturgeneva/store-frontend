<template>
    <div class="userLoginRegister">
        <form>
            <label for="email">Email</label>
            <!-- <br> -->
            <input type="text" name="email" id="email">
            <!-- <br> -->
            <label for="password">Password</label>
            <!-- <br> -->
            <input type="password" name="password" id="password">
            <!-- <br> -->
            <div class="buttons">
                <button class="loginButton">Log in</button>
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
    /* padding: 0.3rem; */
}

input {
    padding: 0.2rem;
}

.buttons {
    display: flex;
    /* width: 10rem; */
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
    /* font-size: 0.8rem; */
}

.loginButton {
    /* background-color: rgb(203, 190, 173); */
    background-color: rgb(163, 168, 170);
}

</style>