using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Data.SqlClient;

namespace TemplareImplement.Helper
{
    public class SqlHelper : ISqlHelper
    {
        protected string ConnectionString;
        protected int CommandTimeout;
        private IConfiguration _config;
        public SqlHelper(IConfiguration configuration)
        {
            _config = configuration;
            ConnectionString = _config.GetConnectionString("ConStr");
            CommandTimeout = 60;
        }
        public MEMBERS.SQLReturnValue ExecuteProceduerWithMessage(string ProceduerName, string[,] paramvalue, bool AddOutputparameter)
        {
            SqlCommand cmd = null;
            SqlConnection conn = null;
            MEMBERS.SQLReturnValue m = new MEMBERS.SQLReturnValue();
            try
            {
                cmd = new SqlCommand();
                cmd.CommandText = ProceduerName;
                conn = new SqlConnection(ConnectionString);
                cmd.Connection = conn;
                cmd.CommandType = CommandType.StoredProcedure;
                SqlParameter[] param = new SqlParameter[paramvalue.GetUpperBound(0) + 1];
                for (int i = 0; i < param.Length; i++)
                {
                    param[i] = new SqlParameter("@" + paramvalue[i, 0].ToString(), paramvalue[i, 1].ToString());
                }
                cmd.Parameters.AddRange(param);
                if (AddOutputparameter)
                {
                    cmd.Parameters.Add("OUTVAL", SqlDbType.Int).Direction = ParameterDirection.Output;
                    cmd.Parameters.Add("OUTMESSAGE", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                }
                if (conn.State != ConnectionState.Open) { conn.Open(); }
                cmd.ExecuteNonQuery();
                conn.Close();
                m.OUTMESSAGE = cmd.Parameters["OUTMESSAGE"].Value.ToString();
                m.Outval = int.Parse(cmd.Parameters["OUTVAL"].Value.ToString());
            }
            catch (Exception _Exception)
            {
                m.OUTMESSAGE = _Exception.Message.ToString();
                m.Outval = 0;
            }
            finally
            {
                if (cmd != null) { cmd.Dispose(); }
                if (conn != null) { conn.Dispose(); }
            }
            return m;
        }
        public MEMBERS.SQLReturnValue ExecuteProcedureGetDetails(string ProcedureName, string[,] ParamValue)
        {
            SqlConnection conn = new SqlConnection(ConnectionString);
            SqlCommand cmd = null;
            MEMBERS.SQLReturnValue m = new MEMBERS.SQLReturnValue();
            try
            {
                SqlParameter[] param = new SqlParameter[ParamValue.GetUpperBound(0) + 1];
                for (int i = 0; i < param.Length; i++)
                {
                    param[i] = new SqlParameter("@" + ParamValue[i, 0].ToString(), ParamValue[i, 1].ToString());
                }
                cmd = new SqlCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddRange(param);
                cmd.Parameters.Add("@OUTVAL", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@OUTMESSAGE", SqlDbType.VarChar, 200).Direction = ParameterDirection.Output;
                cmd.CommandText = ProcedureName;
                cmd.Connection = conn;
                DataTable dt = new DataTable();
                if (conn.State != ConnectionState.Open) { conn.Open(); }
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    da.Fill(dt);
                }
                if (cmd.Parameters.Contains("@OUTMESSAGE"))
                    m.OUTMESSAGE = Convert.ToString(cmd.Parameters["@OUTMESSAGE"].Value);

                if (cmd.Parameters.Contains("@OUTVAL"))
                    m.Outval = int.Parse(cmd.Parameters["@OUTVAL"].Value.ToString());
                m.RetDatatable = dt;
            }
            catch (Exception _Exception)
            {
                m.OUTMESSAGE = _Exception.Message.ToString();
                m.Outval = 0;
            }
            finally
            {
                if (conn.State == ConnectionState.Open) { conn.Close(); }
                if (cmd != null) { cmd.Dispose(); }
                if (conn != null) { conn.Dispose(); }
            }
            return m;
        }
        public MEMBERS.SQLReturnValue ExecuteQuery(string Query)
        {
            SqlConnection conn = null;
            SqlDataAdapter da = null;
            MEMBERS.SQLReturnValue m = new MEMBERS.SQLReturnValue();
            try
            {
                conn = new SqlConnection(ConnectionString);
                da = new SqlDataAdapter(Query, conn);
                DataTable dt = new DataTable();
                da.Fill(dt);
                m.Outval = dt.Rows.Count;
                m.RetDatatable = dt;
            }
            catch (Exception _Exception)
            {
                m.OUTMESSAGE = _Exception.Message.ToString();
                m.Outval = 0;
            }
            finally
            {
                if (da != null) { da.Dispose(); }
                if (conn != null) { conn.Dispose(); }
            }
            return m;
        }
    }
}
