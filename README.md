Welcome to HeatWave!

## How to use
```html
<script type="text/javascript" src="http://192.168.110.172:3000/javascripts/<?=$this->jxyrole ? $this->jxyrole : 'client'?>_loader.js"></script>
<script type="text/javascript">
    hwloader.load('http://192.168.110.172', 3000, function() {
        hwclient.init({uid : <?=$this->user->userID?>, host : '192.168.110.172', port : 3000, insights : <?=$this->jxyinsight ? $this->jxyinsight : 0?>});
    });
</script>
```