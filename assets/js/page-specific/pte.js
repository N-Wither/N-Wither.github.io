let elements = document.querySelectorAll('.element')

let symbolToName = {
    H: 'Hydrogen',
    He: 'Helium',
    Li: 'Lithium',
    Be: 'Beryllium',
    B: 'Boron',
    C: 'Carbon',
    N: 'Nitrogen',
    O: 'Oxygen',
    F: 'Fluorine',
    Ne: 'Neon',
    Na: 'Sodium',
    Mg: 'Magnesium',
    Al: 'Aluminum',
    Si: 'Silicon',
    P: 'Phosphorus',
    S: 'Sulfur',
    Cl: 'Chlorine',
    Ar: 'Argon',
    K: 'Potassium',
    Ca: 'Calcium',
    Sc: 'Scandium',
    Ti: 'Titanium',
    V: 'Vanadium',
    Cr: 'Chromium',
    Mn: 'Manganese',
    Fe: 'Iron',
    Co: 'Cobalt',
    Ni: 'Nickel',
    Cu: 'Copper',
    Zn: 'Zinc',
    Ga: 'Gallium',
    Ge: 'Germanium',
    As: 'Arsenic',
    Se: 'Selenium',
    Br: 'Bromine',
    Kr: 'Krypton',
    Rb: 'Rubidium',
    Sr: 'Strontium',
    Y: 'Yttrium',
    Zr: 'Zirconium',
    Nb: 'Niobium',
    Mo: 'Molybdenum',
    Tc: 'Technetium',
    Ru: 'Ruthenium',
    Rh: 'Rhodium',
    Pd: 'Palladium',
    Ag: 'Silver',
    Cd: 'Cadmium',
    In: 'Indium',
    Sn: 'Tin',
    Sb: 'Antimony',
    Te: 'Tellurium',
    I: 'Iodine',
    Xe: 'Xenon',
    Cs: 'Caesium',
    Ba: 'Barium',
    La: 'Lanthanum',
    Ce: 'Cerium',
    Pr: 'Praseodymium',
    Nd: 'Neodymium',
    Pm: 'Promethium',
    Sm: 'Samarium',
    Eu: 'Europium',
    Gd: 'Gadolinium',
    Tb: 'Terbium',
    Dy: 'Dysprosium',
    Ho: 'Holmium',
    Er: 'Erbium',
    Tm: 'Thulium',
    Yb: 'Ytterbium',
    Lu: 'Lutetium',
    Hf: 'Hafnium',
    Ta: 'Tantanium',
    W: 'Tungsten',
    Re: 'Rhenium',
    Os: 'Osmium',
    Ir: 'Iridium',
    Pt: 'Platinum',
    Au: 'Gold',
    Hg: 'Mercury',
    Tl: 'Thallium',
    Pb: 'Lead',
    Bi: 'Bismuth',
    Po: 'Polonium',
    At: 'Astatine',
    Rn: 'Radon',
    Fr: 'Francium',
    Ra: 'Radium',
    Ac: 'Actinium',
    Th: 'Thorium',
    Pa: 'Protactinium',
    U: 'Uranium',
    Np: 'Neptunium',
    Pu: 'Plutonium',
    Am: 'Americium',
    Cm: 'Curium',
    Bk: 'Berkelium',
    Cf: 'Californium',
    Es: 'Einsteinium',
    Fm: 'Fermium',
    Md: 'Mendelevium',
    No: 'Nobelium',
    Lr: 'Lawrencium',
    Rf: 'Rutherfordium',
    Db: 'Dubnium',
    Sg: 'Seaborgium',
    Bh: 'Bohrium',
    Hs: 'Hassium',
    Mt: 'Meitnerium',
    Ds: 'Darmstadtium',
    Rg: 'Roentgenium',
    Cn: 'Copernicium',
    Nh: 'Nihonium',
    Fl: 'Flerovium',
    Mc: 'Moscovium',
    Lv: 'Livermorium',
    Ts: 'Tennessine',
    Og: 'Oganesson',
    Uue: 'Ununennium',
    Ubn: 'Unbinilium',
    Ubu: 'Unbiunium',
    Ubb: 'Unbibium',
    Ubt: 'Unbitrium',
    Ubq: 'Unbiquadium',
    Ubp: 'Unbipentium',
    Ubh: 'Unbihexium',
    Ubs: 'Unbiseptium'
}

elements.forEach(el => {
    if(el.getAttribute('no-gen-content')) return;
    let number = el.getAttribute('n')
    let symbol = el.getAttribute('s')
    let weight = el.getAttribute('w')
    let template = `<span class="number">${number}</span> <span class="symbol">${symbol}</span> <span class="weight">${weight}</span>`

    el.innerHTML = template
    
    el.id = el.querySelector('.symbol').innerHTML
    
    let tip = document.createElement('div')
    tip.classList.add('tooltip')
    tip.innerHTML = symbolToName[el.id]
    tip.id = 'tooltip-' + el.id
    el.appendChild(tip)

    let popperInstance = Popper.createPopper(el, document.getElementById('tooltip-' + el.id), { placement: 'bottom' })

    function show() {
        // Make the tooltip visible
        tip.setAttribute('data-show', '');

        // Enable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: 'eventListeners', enabled: true },
            ],
        }));

        // Update its position
        popperInstance.update();
    }

    function hide() {
        // Hide the tooltip
        tip.removeAttribute('data-show');

        // Disable the event listeners
        popperInstance.setOptions((options) => ({
            ...options,
            modifiers: [
                ...options.modifiers,
                { name: 'eventListeners', enabled: false },
            ],
        }));
    }

    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];

    showEvents.forEach((event) => {
        el.addEventListener(event, show);
    });

    hideEvents.forEach((event) => {
        el.addEventListener(event, hide);
    });
    
})

document.querySelectorAll('.symbol').forEach(el => {
    el.setAttribute('translate', 'no')
})