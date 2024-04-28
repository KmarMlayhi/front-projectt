$(document).ready(function () {
  var contactForm = $('#contactForm');
  var contactContainer = $('.contacts-container');
  var noContactsText = $('.contacts-container p');
  var prenomInput = $('#prenom');
  var nomInput = $('#nom');
  var telephoneInput = $('#telephone');
  var civiliteInput = $('#civilite');
  var detailContainer = $('.détail-contact');

  var selectedIndex = -1; // Variable pour stocker l'index du contact sélectionné

  contactForm.hide();
  detailContainer.hide();

  $('.btn-container .btn:first-child').click(function (event) {
    event.preventDefault();
    contactForm.show();
    detailContainer.hide();
    prenomInput.val('');
    nomInput.val('');
    telephoneInput.val('');
    civiliteInput.val('');
  });

  $('.btn-container .btn:last-child').click(function (event) {
    noContactsText.show();
    event.preventDefault();
    $('.contact').remove();
    $('.détail-contact').remove();
    localStorage.removeItem('contacts');
    contactForm.hide();
    detailContainer.hide();
  });

  


  loadContacts();

  function loadContacts() {
    var storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
  
    storedContacts.forEach(function (contact, index) {
      $('#contacts').append(`<div class="contact">
        <div class="contact-box"> 
        <img src="icon-personne.png" alt="Person icon" class="person-icon"> 
        <span data-index="${index}" class="contact-name">${contact.prenom} ${contact.nom}</span>
        </div> 
        </div>`);
    });
    if (storedContacts.length > 0) {
      noContactsText.hide();
    }
    
  }
  contactForm.submit(function (event) {
    event.preventDefault();

    var prenom = prenomInput.val();
    var nom = nomInput.val();
    var telephone = telephoneInput.val();
    var civilite = civiliteInput.val();

    var storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];

    if (selectedIndex > -1) { 
      storedContacts[selectedIndex] = {
        civilite: civilite,
        prenom: prenom,
        nom: nom,
        telephone: telephone
      };
      selectedIndex = -1; 
    } else {
      var contactExists = $('.contact-box span:contains("' + prenom + ' ' + nom + '")').length > 0;
      if (contactExists) {
        contactForm.hide();
        alert('Ce contact existe déjà.');
        return;
      }

      var newContact = {
        civilite: civilite,
        prenom: prenom,
        nom: nom,
        telephone: telephone
      };
      storedContacts.push(newContact);
    }

    storedContacts.sort((a, b) => (a.nom + ' ' + a.prenom).localeCompare(b.nom + ' ' + b.prenom));

    localStorage.setItem('contacts', JSON.stringify(storedContacts));

    $('#contacts').empty();
    loadContacts();
    contactForm.hide();
  });
  $('#contacts').on('click', '.contact-name' ,function () {
    selectedIndex = $(this).data('index'); 
    $('.contact-box').not(this).removeClass('clicked');
    $(this).parent().toggleClass('clicked');
    contactForm.hide();
    detailContainer.toggle();
    var storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    let contact = storedContacts[selectedIndex];
    $('#contact-detail').html(`<h2>Détail du contact</h2> 
      <p> ${contact.civilite} ${contact.nom} ${contact.prenom} </p>
      <p>Tel : ${contact.telephone}</p> 
      <input type="button" value="Modifier" class="btn modifier-btn">`);
  });


  $('.détail-contact').on('click', '.modifier-btn', function (event) {
    event.preventDefault();
    contactForm.show();
    detailContainer.hide();
    let index = selectedIndex;
    var storedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    var contact = storedContacts[index];
    $('#civilite').val(contact.civilite);
    $('#prenom').val(contact.prenom);
    $('#nom').val(contact.nom);
    $('#telephone').val(contact.telephone);
  });
}); 