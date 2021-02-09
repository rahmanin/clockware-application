window.replainSettings = { 
  id: 'a852f292-ed7b-447a-9c32-3082ce3adcd0', 
  showChat: true,
  fields: {
    name: window.user?.role === "client" ? window.user.username : "",
    email: window.user?.role === "client" ? window.user.email : "",
  }
};
(function(u){var s=document.createElement('script');s.type='text/javascript';s.async=true;s.src=u;
var x=document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);
})('https://widget.replain.cc/dist/client.js');
