// Run with: playwright-cli -s=aqua run-code --filename=tests/ecosystem.browser.js
async page => {
  const errors=[],failedRequests=[],passed=[];
  const assert=(condition,message)=>{if(!condition)throw new Error(message);passed.push(message)};
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('requestfailed',r=>failedRequests.push(r.url()));
  await page.setViewportSize({width:1440,height:1000});
  await page.reload();await page.waitForFunction(()=>!!window.aqua);
  const state=()=>page.evaluate(()=>window.aqua.getState());
  const initial=await state();
  assert(initial.fish.length===6&&new Set(initial.fish.map(f=>f.species)).size===6,'Six distinct species');
  assert(new Set(initial.fish.map(f=>f.shape)).size===6,'Six different body silhouettes');
  assert(new Set(initial.fish.map(f=>f.behavior)).size===6&&new Set(initial.fish.map(f=>f.speed)).size===6,'Independent movement profiles and speeds');
  assert(initial.plants===26&&Object.values(initial.plantTypes).every(n=>n>0),'Six plant types and 26 clusters');
  assert(initial.crabs.length===2&&initial.snails.length===6,'Two crabs and six snails');
  assert(new Set(initial.snails.map(s=>s.surface)).size===4,'Snails inhabit front glass, side glass, bottom, and a rock');
  assert(initial.shells===12&&initial.hidingPlaces===2&&initial.stones===50,'Shells, additional stones, and two shelters');
  assert(initial.camera.every((v,i)=>Math.abs(v-[8.4,6.5,11.8][i])<.001),'Original desktop camera preserved');
  const sample=await page.evaluate(()=>new Promise(resolve=>{
    let frames=0,boundsViolations=0,qualityChanges=0,crabCollisions=0,restsSeen=0;
    const start=performance.now(),first=window.aqua.getState(),size=first.framebuffer;
    function check(){
      frames++;const s=window.aqua.getState();
      if(s.renderScale!==1||s.framebuffer.width!==size.width||s.framebuffer.height!==size.height)qualityChanges++;
      for(const f of s.fish){const a=f.bounds.min,b=f.bounds.max;if(a[0]<-2.7001||b[0]>2.7001||a[1]<.5899||b[1]>3.4301||a[2]<-1.2001||b[2]>1.2001)boundsViolations++}
      for(const c of s.crabs){if(c.clearance<.1899)crabCollisions++;if(c.rest>0)restsSeen++}
      if(performance.now()-start>24000)resolve({frames,fps:Math.round(frames*1000/(performance.now()-start)),boundsViolations,qualityChanges,crabCollisions,restsSeen,before:first,after:s});else requestAnimationFrame(check);
    }requestAnimationFrame(check);
  }));
  assert(sample.qualityChanges===0,'Native resolution stays constant for 24 seconds; no automatic quality change');
  assert(sample.boundsViolations===0,'All fish and fins remain inside the tank');
  assert(sample.crabCollisions===0,'Crabs stay clear of rock and plant obstacles');
  assert(sample.restsSeen>0,'Crabs occasionally rest');
  assert(sample.after.crabs.every(c=>c.distance>.12),'Both crabs crawl across the bottom');
  assert(sample.after.snails.every(s=>s.distance>.03),'All six snails slowly crawl');
  assert(sample.after.fish.every((f,i)=>f.travelled>sample.before.fish[i].travelled+.8),'Every fish follows its own active path');
  await page.getByRole('button',{name:'Pause animation',exact:true}).click();
  const paused=await state();await page.waitForTimeout(450);const frozen=await state();
  assert(paused.elapsed===frozen.elapsed&&JSON.stringify(paused.fish)===JSON.stringify(frozen.fish)&&JSON.stringify(paused.crabs)===JSON.stringify(frozen.crabs)&&JSON.stringify(paused.snails)===JSON.stringify(frozen.snails),'Pause freezes fish, bottom life, and water/plant time');
  await page.getByRole('button',{name:'Resume animation',exact:true}).click();
  await page.locator('#bubbles').click();assert(!(await state()).bubblesEnabled,'Bubble control works');await page.locator('#bubbles').click();
  await page.locator('#light').click();assert((await state()).moonlight,'Moonlight control works');await page.locator('#light').click();
  await page.locator('#orbit').click();const orbit=await state();await page.waitForTimeout(500);assert(JSON.stringify(orbit.camera)!==JSON.stringify((await state()).camera),'Automatic orbit works');await page.locator('#orbit').click();
  await page.locator('#reset').click();await page.waitForTimeout(1700);assert((await state()).camera.every((v,i)=>Math.abs(v-[8.4,6.5,11.8][i])<.08),'Camera reset works');
  await page.locator('#about').click();assert(await page.locator('#fish-info').evaluate(e=>e.open)&&await page.locator('.resident-list > div').count()===6,'Resident guide includes all six species');await page.keyboard.press('Escape');
  await page.screenshot({path:'output/aqua-ecosystem-desktop.png'});
  const browser=page.context().browser();
  const mobileContext=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const mobile=await mobileContext.newPage();mobile.on('pageerror',e=>errors.push(e.message));mobile.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await mobile.goto(page.url());await mobile.waitForFunction(()=>!!window.aqua);await mobile.waitForTimeout(500);
  const layout=await mobile.evaluate(()=>({width:innerWidth,height:innerHeight,canvas:document.querySelector('canvas').getBoundingClientRect().toJSON(),state:window.aqua.getState(),overflow:document.documentElement.scrollWidth>innerWidth,controls:[...document.querySelectorAll('.toolbar button')].every(b=>{const r=b.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight})}));
  assert(!layout.overflow&&layout.controls&&Math.abs(layout.canvas.width-390)<1&&Math.abs(layout.canvas.height-844)<1,'Mobile canvas and controls fit the viewport');
  assert(layout.state.framebuffer.width===780&&layout.state.framebuffer.height===1688&&layout.state.renderScale===1,'Retina mobile uses full device-pixel resolution');
  await mobile.screenshot({path:'output/aqua-ecosystem-mobile.png',scale:'css'});
  await mobile.emulateMedia({reducedMotion:'reduce'});await mobile.reload();await mobile.waitForFunction(()=>!!window.aqua);assert(await mobile.evaluate(()=>window.aqua.getState().paused),'Reduced motion starts the entire ecosystem paused');
  await mobileContext.close();
  assert(errors.length===0,'No console or page errors');assert(failedRequests.length===0,'No failed asset requests');
  return {passed,sample:{frames:sample.frames,fps:sample.fps,boundsViolations:sample.boundsViolations,qualityChanges:sample.qualityChanges,crabCollisions:sample.crabCollisions},errors,failedRequests};
}
