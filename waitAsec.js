module.exports = async function waitAsec() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 1000);
    })
}