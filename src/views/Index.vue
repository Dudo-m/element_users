<template>
    <div>
        <el-container>
            <el-header>
            <!--导航菜单-->
                <el-menu router :default-active="activeIndex" class="el-menu-demo" mode="horizontal" >
                    <el-menu-item index="/indexs">主页</el-menu-item>
                    <el-menu-item index="/users">用户管理</el-menu-item>
                    <el-menu-item index="/msgs" disabled>消息中心</el-menu-item>
                    <el-menu-item index="/orders" disabled>订单管理</el-menu-item>
                </el-menu>
            </el-header>
              <router-view/>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Index",
        data() {
            return {
                activeIndex: this.$route.path,
            };
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>