<template>
  <div class="container" :class="{ isDark: isDark, activeSidebar: activeSidebar }">
    <template v-if="show">
      <Toolbar 
        v-if="!isZenMode" 
        @toggle-ai-dialog="showAIDialog = !showAIDialog"
      ></Toolbar>
      <div class="content-wrapper">
        <!-- 左侧思维导图区域 -->
        <Edit class="mind-map-area" ref="mindMap"></Edit>
        
        <!-- AI 对话区域 -->
        <div v-if="showAIDialog" class="ai-dialog-container">
          <AIDialog @add-node="handleAIResponse" />
          <el-button 
            class="close-dialog-btn" 
            :icon="Close"
            circle 
            @click="showAIDialog = false"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Toolbar from './components/Toolbar'
import Edit from './components/Edit'
import { mapState, mapActions, mapMutations } from 'vuex'
import { getLocalConfig } from '@/api'
import AIDialog from '@/components/AIDialog.vue'
import { Close } from '@element-plus/icons-vue'

export default {
  name: 'Index',
  components: {
    Toolbar,
    Edit,
    AIDialog
  },
  data() {
    return {
      show: false,
      showAIDialog: false,
      Close,
    }
  },
  computed: {
    ...mapState({
      isZenMode: state => state.localConfig.isZenMode,
      isDark: state => state.isDark,
      activeSidebar: state => state.activeSidebar
    })
  },
  watch: {
    isDark() {
      this.setBodyDark()
    }
  },
  async created() {
    this.initLocalConfig()
    const loading = this.$loading({
      lock: true,
      text: this.$t('other.loading')
    })
    await this.getUserMindMapData()
    this.show = true
    loading.close()
    this.setBodyDark()
  },
  methods: {
    ...mapActions(['getUserMindMapData']),
    ...mapMutations(['setLocalConfig']),
    /**
     * @Author: 黄原寅
     * @Desc: 初始化本地配置
     */
    initLocalConfig() {
      let config = getLocalConfig()
      if (config) {
        this.setLocalConfig({
          ...this.$store.state.localConfig,
          ...config
        })
      }
    },
    setBodyDark() {
      this.isDark ? document.body.classList.add('isDark') : document.body.classList.remove('isDark')
    },
    /**
     * 处理 AI 响应，添加新节点
     */
    handleAIResponse(aiResponse) {
      const mindMap = this.$refs.mindMap;
      if (!mindMap) return;
      
      // 获取当前选中的节点
      const selectedNode = mindMap.getSelectedNode();
      
      if (selectedNode) {
        // 如果有选中节点，添加为子节点
        mindMap.addChild({
          text: aiResponse,
          expanded: true
        });
      } else {
        // 如果没有选中节点，添加为根节点的子节点
        const root = mindMap.getRootNode();
        if (root) {
          mindMap.addChild({
            text: aiResponse,
            expanded: true
          }, root);
        }
      }
    },
  }
}
</script>

<style lang="less" scoped>
body {
  &.isDark {
    /* el-button */
    .el-button {
      background-color: #363b3f;
      color: hsla(0, 0%, 100%, 0.9);
      border-color: hsla(0, 0%, 100%, 0.1);
    }
    /* el-input */
    .el-input__inner {
      background-color: #363b3f;
      border-color: hsla(0, 0%, 100%, 0.1);
      color: hsla(0, 0%, 100%, 0.9);
    }
    .el-input.is-disabled .el-input__inner {
      background-color: #363b3f;
      border-color: hsla(0, 0%, 100%, 0.1);
      color: hsla(0, 0%, 100%, 0.3);
    }
    .el-input-group__append,
    .el-input-group__prepend {
      background-color: #363b3f;
      border-color: hsla(0, 0%, 100%, 0.1);
    }
    .el-input-group__append button.el-button {
      color: hsla(0, 0%, 100%, 0.9);
    }
    /* el-select */
    .el-select-dropdown {
      background-color: #36393d;
      border-color: hsla(0, 0%, 100%, 0.1);
      .el-select-dropdown__item {
        color: hsla(0, 0%, 100%, 0.6);
      }
      .el-select-dropdown__item.selected {
        color: #409eff;
      }
      .el-select-dropdown__item.hover,
      .el-select-dropdown__item:hover {
        background-color: hsla(0, 0%, 100%, 0.05);
      }
    }
    .el-select .el-input.is-disabled .el-input__inner:hover {
      border-color: hsla(0, 0%, 100%, 0.1);
    }
    /* el-popper*/
    .el-popper {
      background-color: #36393d;
      border-color: hsla(0, 0%, 100%, 0.1);
    }
    .el-popper[x-placement^='bottom'] .popper__arrow {
      background-color: #36393d;
    }
    .el-popper[x-placement^='bottom'] .popper__arrow::after {
      border-bottom-color: #36393d;
    }
    .el-popper[x-placement^='top'] .popper__arrow {
      background-color: #36393d;
    }
    .el-popper[x-placement^='top'] .popper__arrow::after {
      border-top-color: #36393d;
    }
    /* el-tabs */
    .el-tabs__item {
      color: hsla(0, 0%, 100%, 0.6);
      &:hover,
      &.is-active {
        color: #409eff;
      }
    }
    .el-tabs__nav-wrap::after {
      background-color: hsla(0, 0%, 100%, 0.6);
    }
    /* el-slider */
    .el-slider__runway {
      background-color: hsla(0, 0%, 100%, 0.6);
    }
    /* el-radio-group */
    .el-radio-group {
      .el-radio-button__inner {
        background-color: #36393d;
        color: hsla(0, 0%, 100%, 0.6);
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: #fff;
        background-color: #409eff;
      }
    }
    /* el-dialog */
    .el-dialog {
      background-color: #262a2e;
      .el-dialog__header {
        border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
      }
      .el-dialog__title {
        color: hsla(0, 0%, 100%, 0.9);
      }
      .el-dialog__body {
        background-color: #262a2e;
      }
      .el-dialog__footer {
        border-top: 1px solid hsla(0, 0%, 100%, 0.1);
      }
    }
    /* el-upload */
    .el-upload__tip {
      color: #999;
    }
    /* 富文本编辑器 */
    .toastui-editor-main-container {
      background-color: #fff;
    }
  }
}

.content-wrapper {
  position: relative;
  display: flex;
  height: calc(100vh - 60px);
  
  .mind-map-area {
    flex: 1;
    height: 100%;
  }
}

.ai-dialog-container {
  position: fixed;
  right: 20px;
  top: 80px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  
  .close-dialog-btn {
    position: absolute;
    top: -15px;
    right: -15px;
    z-index: 1001;
  }
}

.isDark {
  .ai-dialog-container {
    background: #262a2e;
    color: #fff;
  }
}
</style>
