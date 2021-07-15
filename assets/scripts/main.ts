console.log('we running!');

if ((window as any).StoryblokBridge) {
  const storyblokInstance = new (window as any).StoryblokBridge()
  
  storyblokInstance.on(['published', 'change'], () => {
      // reload page if save or publish is clicked
      window.location.reload();
  })
}