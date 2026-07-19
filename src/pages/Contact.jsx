import { useState } from 'react'

function Contact() {
  const [message, setMessage] = useState('')

  return (
    <section className="page">
      <h2>Contact</h2>
      <p>
        If you would like to get in touch with me, feel free to reach out via
        email or any of the platforms listed below.
      </p>
      <p>
        Email: shah.dhairya.p13@gmail.com
      </p>
      <p>
        You can also leave a message below:
      </p>
      <form>
        <label htmlFor="message">Message:</label>
        <br />
        <textarea
          id="message"
          rows="4"
          cols="50"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write something..."
        />
      </form>
      {message && (
        <p>
          You typed: {message}
        </p>
      )}
    </section>
  )
}

export default Contact
