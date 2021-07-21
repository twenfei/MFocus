Vue.prototype.$eventBus = new Vue()
$(document).ready(function () {
  createSplash();
  // Task class for TodoList
  function Task(content, coins, id) {
    this.content = content;
    this.status = "In progress";
    this.coins = coins;
    this.id = id;
  }

  let DecreaseSpeed = 3000;

  let naturalDecayHandle = setInterval(() => {
    digiPet.naturalDecay();
  }, DecreaseSpeed);

  let digiPet = new Vue({
    el: '#digiPet',
    data: {
      bgIdx: 0,
      moving: false,
      hygiene: 100,
      hunger: 100,
      entertainment: 100,
      is_dead: false,
      backgrounds: [
        "img/background0.jpg",
        "img/background1.jpg",
        "img/background2.jpg",
        "img/background3.jpg",
        "img/background4.jpg",
        "img/background5.jpg",
        "img/background6.jpg",
        "img/background7.gif",
        "img/background8.gif",
        "img/background9.gif",
        "img/background10.gif"
      ],
      say_url: "img/hello.png",
      pet_url: "img/digiPet3.gif",
      scene_url: "img/background0.jpg",
      log_txt: "Please take good care of your pet!"
    },
    mounted() {
      this.$eventBus.$on('recoverHunger', (val) => {
        if (!this.is_dead) { this.setHunger(val); }
        else { this.log_txt += '\nPlease revive your pet using the revive potion first!'; }
      });
      this.$eventBus.$on('recoverHygiene', (val) => {
        if (!this.is_dead) { this.setHygiene(val); }
        else { this.log_txt += '\nPlease revive your pet using the revive potion first!'; }
      });
      this.$eventBus.$on('recoverEntertainment', (val) => {
        if (!this.is_dead) { this.setEntertainment(val); }
        else { this.log_txt += '\nPlease revive your pet using the revive potion first!'; }
      });
      this.$eventBus.$on('recoverAll', (val) => {
        if (val == 100 && this.pet_url === "img/ghost.gif") {
          this.pet_url = "img/digiPet3.gif";
          this.log_txt += '\nMiracle happened!!!Your pet is resurrected';
        }
        this.setEntertainment(val);
        this.setHygiene(val);
        this.setHunger(val);
        setInterval(() => {
          digiPet.naturalDecay();
        }, DecreaseSpeed);
      });
    },
    methods: {
      naturalDecay: function () {
        if (this.pet_url != "img/ghost.gif" && (this.hygiene <= 0 || this.hunger <= 0 || this.entertainment <= 0)) {
          this.log_txt += '\nYour pet died...Sadness overflows...';
          this.pet_url = "img/ghost.gif";
          this.say_url = "img/nosay.png";
          this.is_dead = true;
          clearInterval(naturalDecayHandle);
        }
        else {
          if (this.hygiene == 50)
            this.log_txt += '\nYour pet needs a bath!';
          if (this.hunger == 50)
            this.log_txt += '\nYour pet needs to eat!';
          if (this.entertainment == 50)
            this.log_txt += '\nYour pet needs some fun!';
          this.hygiene -= 5; // TODO: for the purpose of demo
          this.hunger -= 5;
          this.entertainment -= 5;
          this.hygiene = Math.max(this.hygiene, 0);
          this.hunger = Math.max(this.hunger, 0);
          this.entertainment = Math.max(this.entertainment, 0);
        }
      },
      setHygiene: function (val) {
        this.hygiene = Math.min(this.hygiene + val, 100);
      },
      setHunger: function (val) {
        this.hunger = Math.min(this.hunger + val, 100);
      },
      setEntertainment: function (val) {
        this.entertainment = Math.min(this.entertainment + val, 100);
      },
      movePet: function (event) {
        if (!this.moving) {
          this.moving = true;
          let x = Math.min(event.pageX, 500);
          let y = Math.min(event.pageY, 380);
          let currX = parseInt($(".pet1").css("left"));
          let currY = parseInt($(".pet1").css("top"));
          let deltaX = (x - currX) / 30;
          let deltaY = (y - currY) / 30;
          let counter = 30;
          this.say_url = "img/nosay.png";
          var moveEvent = setInterval(() => {
            currX = parseInt($(".pet1").css("left"));
            currY = parseInt($(".pet1").css("top"));
            $(".pet1").css("left", currX + deltaX);
            $(".pet1").css("top", currY + deltaY);
            counter--;
            if (counter === 0) {
              this.moving = false;
              this.say_url = "img/hello.png",
              $(".say1").css("left", currX + deltaX + 44);
              $(".say1").css("top", currY + deltaY - 40);
              clearInterval(moveEvent);
            }
          }, 30);
        }
      },
      plusSlides: function (val) {
        this.bgIdx += val;
        if (this.bgIdx < 0) {
          this.bgIdx = 9;
        }
        if (this.bgIdx > 9) {
          this.bgIdx = 0;
        }
        this.scene_url = this.backgrounds[this.bgIdx];
      }
    }
  })

  let todoList = new Vue({
    el: '#todoList',
    data: {
      todos: [
        new Task("Complete this assignment", 10, 0),
        new Task("Implement Add and Delete", 5, 1),
        new Task("Delete Should delete the first element in this array", 15, 2),
        new Task("Add an additional feature! Be creative!", 10, 3)
      ],
      currentTodo: "",
      deleted: 0,
      currentCoin: '',
      counter: 4
    },
    methods: {
      submit: function () {
        if (this.currentCoin > 50) {
          alert("The maximum number of coins you can set for your task is 50");
          return;
        }
        // console.log(this.currentCoin);
        if (this.currentTodo === "" || this.currentCoin == 0) return;

        const todo = this.currentTodo.replace(/happy/gi, "😄");

        // TODO: add coin box
        this.todos.push(new Task(todo, this.currentCoin, this.counter++));
        this.currentTodo = "";
        this.currentCoin = '';
      },
      deleteTodo: function () {
        if (this.todos.length === 0) return;
        this.deleted++;
        this.todos.shift();
      },
      clearCompleted: function() {
        let i = 0;
        for (i = 0; i < this.todos.length;){
          if (this.todos[i].status === "Completed"){
            this.todos.splice(i,1);
          }else{
            i++;
          }
        }
      },
      checkTask: function (event) {
        let currId = event.currentTarget.id;
        let currButton = event.currentTarget;
        let currItem = this.todos[currId - this.deleted];
        if (currItem.status === "In progress") {
          currItem.status = "Completed"
          currButton.innerText = "Completed!😄";
          $(currButton).css('background-color', 'red');
          this.$eventBus.$emit('earn-coins', currItem.coins);
        } else if (currItem.status === "Completed") {
          currItem.status = "In progress"
          currButton.innerText = "In progress";
          this.$eventBus.$emit('loss-coins', currItem.coins);
          $(currButton).css('background-color', '#00B454');
        }
      }
    }
  })


  let eshop = new Vue({
    el: '#eshop',
    data: {
      itemUsed: 0,
      wallet: 10,
      backpackImg: "../img/backpack.png",
      backpack: [],
      items: [
        { image_url: "item0.jpg", content: "Milk and bread", cost: 10, itemId: 0, type: 'f', effect: 10 },
        { image_url: "item1.jpg", content: "Steak", cost: 20, itemId: 1, type: 'f', effect: 10 },
        { image_url: "item2.jpg", content: "Cake", cost: 15, itemId: 2, type: 'f', effect: 10 },
        { image_url: "item3.png", content: "Soda drink", cost: 10, itemId: 3, type: 'h', effect: 10 },
        { image_url: "item4.png", content: "Medkit", cost: 10, itemId: 4, type: 'h', effect: 10 },
        { image_url: "item5.jpg", content: "Vacuum", cost: 30, itemId: 5, type: 'h', effect: 10 },
        { image_url: "item6.png", content: "Sleeping bag", cost: 10, itemId: 6, type: 'e', effect: 10 },
        { image_url: "item7.png", content: "Fishing rod", cost: 20, itemId: 7, type: 'e', effect: 10 },
        { image_url: "item8.png", content: "Basketball", cost: 20, itemId: 8, type: 'e', effect: 10 },
        { image_url: "item9.png", content: "Small recovery potion", cost: 50, itemId: 9, type: 'r', effect: 30 },
        { image_url: "item10.png", content: "Medium recovery potion", cost: 100, itemId: 10, type: 'r', effect: 70 },
        { image_url: "item11.png", content: "Large revive potion", cost: 200, itemId: 11, type: 'r', effect: 100 }
      ],
      songs: [
        { id: 1, name: 'singer1', title: 'Song1', src: './audio/ducks-thames.wav' },
        { id: 2, name: 'singer2', title: 'Song2', src: './audio/antidisestablishmenterianism.wav' },
        { id: 3, name: 'singer3', title: 'Song3', src: './audio/bassoon-c4.wav' },
        { id: 4, name: 'singer4', title: 'Song4', src: './audio/gonga-2.wav' }
      ],
      currentIndex: 0
    },
    mounted() {
      this.$eventBus.$on('earn-coins', (coins) => {
        this.updateWallet(coins);
      });
      this.$eventBus.$on('loss-coins', (coins) => {
        this.updateWallet(-1 * coins);
      });
    },
    methods: {
      updateWallet: function (coins) {
        this.wallet += coins * 1;
        console.log(this.wallet);
      },
      addToBag: function (e) {
        let currId = e.currentTarget.id;
        console.log(currId);
        this.backpack.push(currId);
        this.updateWallet(-1 * this.items[currId].cost);
      },
      useItem: function (idx) {
        console.log(idx);
        let item = this.items[this.backpack[idx]];
        if (item.type == 'f') {
          this.$eventBus.$emit('recoverHunger', item.effect);
        } else if (item.type == 'h') {
          this.$eventBus.$emit('recoverHygiene', item.effect);
        } else if (item.type == 'r') {
          this.$eventBus.$emit('recoverAll', item.effect);
        } else {
          this.$eventBus.$emit('recoverEntertainment', item.effect);
        }
        this.backpack.splice(idx, 1);
      },
      clickHandle: function (index) {
        console.log(this);
        this.currentIndex = index;
      },
      nextsong: function () {
        console.log(this.songs.length);
        console.log(this.currentIndex);
        if (this.currentIndex == this.songs.length - 1) {
          this.currentIndex = -1;
        }
        this.currentIndex++;
        console.log(this.currentIndex);
      }
    },
    computed: {
      currentSrc() {
        return this.songs[this.currentIndex].src;
      }
    },
    created() {

    }
  })
});

function createSplash() {

  var bg = "<div id='bg'><img src='img/splash.gif' alt='splash' width='300' style='position: absolute; top: 270px; left: 520px'><div id='font'>Welcome to M Focus</div></div>";
  $("body").prepend(bg);
  $("#bg").css({ "position": "absolute", "width": 2000, "height": 1000, "background": "#ffffff", "left": 0, "top": 0, "z-index": 6 });

  $("#font").css({ "position": "relative", "font-size": "45px", "left": 490, "top": 550, "font-style": "italic" });
  setTimeout(function () {
    // console.log("hi");
    $("#bg").fadeOut();
    $("#bg").remove();
  }, 3000);

}
