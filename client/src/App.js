import React, { useState } from "react";

function App() {
  const [pagesInput, setPagesInput] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/cutpdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pagesInput }),
      });
      const data = await response.text();
      setMessage(data);
    } catch (err) {
      console.log(err);
      setMessage("An error occurred while processing the PDF");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: "lightskyblue",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          minWidth: "300px",
          maxWidth: "600px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2rem",
            marginBottom: "20px",
            fontWeight: "bold",
            color: "rgb(68, 68, 68)",
          }}
        >
          Cut PDF
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="pagesInput"
              style={{
                display: "block",
                fontSize: "1.2rem",
                marginBottom: "10px",
                fontWeight: "bold",
                color: "rgb(68, 68, 68)",
              }}
            >
              Pages to keep:
            </label>
            <input
              type="text"
              id="pagesInput"
              value={pagesInput}
              onChange={(e) => setPagesInput(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1.2rem",
                border: "none",
                borderRadius: "5px",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: "rgb(68, 68, 68)",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: "5px",
              padding: "10px",
              minWidth: "100px",
              cursor: "pointer",
            }}
          >
            {loading ? "Loading..." : "Cut PDF"}
          </button>
        </form>
        {message && (
          <p
            style={{
              marginTop: "20px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: message.includes("successfully")
                ? "green"
                : "rgb(68, 68, 68)",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
