<template>
  <div
    :style="
      this.darkMode
        ? { 'background-color': spaceCadetDark }
        : { 'background-color': '#373B53' }
    "
    class="control-panel"
  >
    <img class="logo" src="../assets/logo.svg" alt="logo" />

    <div class="info">
      <div class="theme-container">
        <img
          v-if="darkMode"
          @click="TOGGLE_DARK_MODE"
          class="theme-icon"
          src="../assets/icon-sun.svg"
          alt="sun"
        />
        <img
          v-if="!darkMode"
          @click="TOGGLE_DARK_MODE"
          class="theme-icon"
          src="../assets/icon-moon.svg"
          alt="sun"
        />
      </div>

      <img src="../assets/image-avatar.jpg" alt="" class="avatar" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState } from "vuex";

export default {
  methods: {
    ...mapMutations(["TOGGLE_DARK_MODE"]),
  },
  computed: {
    ...mapGetters([
      //CSS styles
      "xiketic",
      "cultured",
      "lightCoral",
      "redSalsa",
      "richBlack",
      "glaucous",
      "coolGrey",
      "lavenderWeb",
      "spaceCadetLight",
      "spaceCadetDark",
      "mediumPurple",
      "mediumSlateBlue",
    ]),
    ...mapState(["darkMode"]),
  },
};
</script>

<style scoped lang="scss">
.control-panel {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: v-bind(spaceCadetDark);
  height: 100vh;
  border-radius: 0 30px 0 0;
  z-index: 4;

  .logo {
    width: 100%;
  }

  .info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .theme-container {
    width: 100%;
    padding: 28px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #494e6e;
    cursor: pointer;
  }

  .avatar {
    border-radius: 100%;
    width: 40px;
    margin: 24px 32px;
  }
}

@media (max-width: "960px") {
  .control-panel {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: v-bind(spaceCadetDark);
    height: 80px;
    width: 100%;
    border-radius: 0 0 0 0;

    .logo {
      width: auto;
      height: 100%;
    }

    .info {
      width: auto;
      height: 100%;
      flex-direction: row;
    }

    .theme-container {
      width: auto;
      height: 100%;
      padding: 0 28px;
      display: flex;
      border-bottom: none;
      border-right: 1px solid #494e6e;
      cursor: pointer;
    }
  }
}
</style>
