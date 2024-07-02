function animate(func: Function) {
  var shouldRenderNext = true;
  var animationFrame = requestAnimationFrame(function inner() {
    func();

    if (shouldRenderNext) animationFrame = requestAnimationFrame(inner);
  });

  return () => {
    shouldRenderNext = false;
    cancelAnimationFrame(animationFrame);
  };
}

export default animate;
