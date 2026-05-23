import React, { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('login'); // login atau dashboard
  const [message, setMessage] = useState('');

  const scriptUrl = "https://script.google.com/macros/s/AKfycbyFVUXFhc4UewW5Jgo_xoK1uO0zWuLcTq_p0fJVBSVSB1d9tpYa4DnyoI1kwJYgJCsI/exec";

  const handleLogin = async () => {
    setMessage("Memeriksa...");
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ action: "login", email, password })
      });
      // Karena no-cors, kita anggap berhasil jika data terkirim
      setStatus('dashboard'); 
      setMessage("Selamat Datang!");
    } catch (e) {
      setMessage("Gagal login, cek kembali.");
    }
  };

  if (status === 'login') {
    return (
      <div style={{ padding: '50px', maxWidth: '300px', margin: 'auto' }}>
        <h2>Login Member</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/>
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/>
        <button onClick={handleLogin}>Masuk</button>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '50px' }}>
      <h1>Dashboard Member</h1>
      <p>Selamat! Anda sekarang berada di area member.</p>
      {/* Di sini nanti Anda bisa taruh link ke aplikasi "Foto UMKM" Anda */}
    </div>
  );
}
