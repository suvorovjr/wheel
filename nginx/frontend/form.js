document.querySelector("#callback-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("http://localhost/api/v1/send-message/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data), // Преобразуем в JSON
        });

        if (response.ok) {
            const responseData = await response.json();
            alert(responseData.message);
        } else {
            alert("Ошибка при отправке формы");
        }
    } catch (error) {
        console.error("Ошибка:", error);
    }
});
