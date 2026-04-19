/**
 * tilt.js
 * Lightweight 3D tilt effect for cards.
 * Tracks mouse position over each .tilt-card and applies
 * CSS perspective + rotateX/Y transforms for a 3D depth feel.
 */

(function () {
  const MAX_TILT = 12; // max degrees of rotation

  function initTilt(card) {
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('mouseenter', onEnter);
  }

  function onEnter(e) {
    // Smooth transition off during hover
    e.currentTarget.style.transition = 'box-shadow 0.3s ease';
  }

  function onMove(e) {
    const card   = e.currentTarget;
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
    const dy     = (e.clientY - cy) / (rect.height / 2); // -1 to 1

    const rotY =  dx * MAX_TILT;
    const rotX = -dy * MAX_TILT;

    // Depth shadow shifts with tilt direction
    const shadowX = dx * 15;
    const shadowY = dy * 15;

    card.style.transition = 'none'; // instant during move
    card.style.transform  =
      `perspective(${800}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
    card.style.boxShadow  =
      `${shadowX}px ${shadowY + 20}px 50px rgba(37,99,235,0.2),
       ${-shadowX * 0.5}px ${-shadowY * 0.5}px 20px rgba(255,255,255,0.5)`;
  }

  function onLeave(e) {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.5s ease';
    card.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    card.style.boxShadow  = '';
  }

  // Apply to all tilt-card elements once DOM is ready
  document.querySelectorAll('.tilt-card').forEach(initTilt);
})();
