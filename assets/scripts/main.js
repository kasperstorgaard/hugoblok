console.log('we running!');

if (window.StoryblokBridge) {
  const storyblokInstance = new window.StoryblokBridge();
  
  storyblokInstance.on(['published', 'change'], () => {
      // reload page if save or publish is clicked
      window.location.reload();
  })
}