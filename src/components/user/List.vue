<template>
    <div>
        <el-table
                height="317"
                :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                style="width: 100%">
            <el-table-column
                    label="编号"
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="姓名"
                    width="180">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>姓名: {{ scope.row.name }}</p>
                        <p>住址: {{ scope.row.address }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.name }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="生日" prop="bir"></el-table-column>
            <el-table-column label="性别" prop="sex"></el-table-column>
            <el-table-column label="地址" prop="address"></el-table-column>
            <el-table-column align="right">
                <template slot="header" slot-scope="scope">
                    <el-input
                            v-model="search"
                            size="mini"
                            placeholder="输入姓名关键字搜索"/>
                </template>
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-popconfirm
                            confirmButtonText='好的'
                            cancelButtonText='不用了'
                            icon="el-icon-info"
                            iconColor="red"
                            title="确定删除当前用户吗？"
                            @onConfirm="handleDelete(scope.$index, scope.row)"
                    >
                        <el-button
                                size="mini"
                                type="danger"
                                slot="reference">删除</el-button>
                        </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!--分页组件-->
        <el-row>
            <el-col :span="10" :offset="14">
                <el-pagination style="margin: 10px 0px;"
                               layout="prev, pager, next, jumper, total"
                               :page-size="pageSize"
                               :current-page="pageNow"
                               :page-sizes="[1,5,10]"
                               @current-change="findPage"
                               :total="total">
                </el-pagination>
            </el-col>
        </el-row>

        <el-button type="success" style="margin: 10px 0px;" @click="saveUserInfo" size="mini">添加</el-button>

        <transition name="el-zoom-in-center">
            <div v-show="show" class="transition-box">
                <el-form :rules="rules" ref="userForm" :model="form" label-suffix=":" label-width="80px">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="生日" prop="bir">
                        <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="form.bir" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-radio-group v-model="form.sex">
                            <el-radio label="男"></el-radio>
                            <el-radio label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address">
                        <el-input type="textarea" v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit('userForm')">保存信息</el-button>
                        <el-button @click="show=!show">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "List",
        data() {
            return {
                tableData: [],
                search:"",
                show:false,
                form: {
                    name: '',
                    bir: '',
                    sex: '男',
                    address: '',
                },
                total:0,
                pageSize:5,
                pageNow:1,
                rules: {
                    name: [
                        { required: true, message: '请输入用户姓名！', trigger: 'blur' },
                    ],
                    bir: [
                        { required: true, message: '请选择用户的生日！', trigger: 'blur' },
                    ],
                    address: [
                        { required: true, message: '请输入用户的地址！', trigger: 'blur' },
                    ],
                }
            }

        },
        methods: {
            findPage(page){
                //处理分页的相关方法
                this.pageNow=page;
                this.findAllTableData(page,this.pageSize);
            },
            handleEdit(index, row) {
                console.log(index, row);
                //展示编辑表单
                this.show = true
                this.form = row;
            },
            handleDelete(index, row) {
                //发送axios处理删除
                this.$http.get("http://localhost:8100/user/delete?id="+row.id).then((res)=>{
                    if(res.data.status){
                        this.$message({
                            message: res.data.msg,
                            type: 'success'
                        });
                        this.findAllTableData();//刷新数据
                    }else{
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    });
            },
            onSubmit(userForm) {
                //输入验证
                this.$refs[userForm].validate((valid) => {
                    if (valid) {
                        //发送请求
                        this.$http.post("http://localhost:8100/user/saveOrUpdate",this.form).then((res)=>{
                            if (res.data.status){
                                this.$message({
                                    message: '恭喜你，'+res.data.msg,
                                    type: 'success'
                                });
                                //清空表单信息
                                this.form = {sex:'男'};
                                //隐藏表单
                                this.show = false;
                                //刷新页面
                                this.findAllTableData();

                            }else {
                                this.$message({
                                    message: res.data.msg,
                                    type: 'error'
                                });
                            }
                        });
                    } else {
                        this.$message({
                            message: "当前输入数据不合法",
                            type: 'error'
                        });
                        return false;
                    }
                });
            },
            findAllTableData(page,size){
                page = page? page :this.pageNow,
                size = size ? size :this.pageSize;

                this.$http.get("http://localhost:8100/user/findByPage?pageNow="+page+"&pageSize="+size).then((res)=>{
                    this.tableData = res.data.users;
                    this.total = res.data.total;
                });
            },
            saveUserInfo(){//点击添加时清空信息
                this.form = {sex:'男'};
                this.show = true;
            }
        },
        created(){
            this.findAllTableData();
        }
    }
</script>

<style scoped>
    .transition-box {
        margin-bottom: 10px;
        width: 100%;
        height: 450px;
        border-radius: 4px;
        padding: 40px 20px;
        box-sizing: border-box;
        margin-right: 20px;
    }
</style>