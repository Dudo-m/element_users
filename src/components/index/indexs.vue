<template>
    <div>
        <el-carousel indicator-position="outside" height="300px">
            <el-carousel-item v-for="item in imgs" :key="item">
                <el-image
                        style="height: 500px"
                        :src="item"
                        fit="fill"></el-image>
            </el-carousel-item>
        </el-carousel>
        <h3>公告：</h3>
        <el-row>
            <el-col :span="20" offset="1" v-for="item in text_list">
                {{item}}
            </el-col>
        </el-row>
    </div>
</template>

<script>

    import homeImage2 from "../../assets/index_images/2.jpg"
    import homeImage3 from "../../assets/index_images/3.jpg"
    import homeImage4 from "../../assets/index_images/4.jpg"
    export default {
        name: "indexs",
        data() {
            return {
                imgs:[homeImage2,homeImage3,homeImage4],
                text_list:["1.增加了分页功能;","2.增加了用户新增的验证;","3.修复了添加用户日期少一天的bug;"]
            }
        }
    }
</script>

<style scoped>

</style>