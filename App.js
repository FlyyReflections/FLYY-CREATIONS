
const form = document.querySelector('#bookingForm');
if(form){
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = {
      order_id: 'EVT-' + Date.now(),
      product_type: 'event_paint_sip',
      package: data.package,
      headcount: Number(data.headcount || 0),
      date: data.date,
      time: data.time,
      venue: data.venue,
      contact: { name: data.name, email: data.email, phone: data.phone },
      brand: { colors: data.colors, vibe: data.vibe },
      assets: { logo_url: data.logo || null },
      text_lines: { line1: 'FLYY', line2: 'REFLECTIONS' },
      brand_easter_eggs: ['11:11','wave halo'],
      notes: data.notes || '',
      rush: data.rush === 'on'
    };
    const WEBHOOK = 'https://example.com/webhook'; // replace with Zapier/Make URL
    try{
      const btn = document.querySelector('#bookBtn');
      btn.disabled = true; btn.textContent = 'Sending…';
      await fetch(WEBHOOK,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      document.querySelector('#bookingSuccess').classList.remove('hidden');
      form.reset();
      btn.disabled = false; btn.textContent = 'Request Booking';
      console.log('Payload sent:', payload);
    }catch(err){
      alert('Could not submit right now. Please try again.');
      console.error(err);
    }
  });
}
