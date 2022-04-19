namespace TemplareImplement.Helper
{
    public interface ISqlHelper
    {
        MEMBERS.SQLReturnValue ExecuteQuery(string Query);
        MEMBERS.SQLReturnValue ExecuteProcedureGetDetails(string ProcedureName, string[,] ParamValue);
        MEMBERS.SQLReturnValue ExecuteProceduerWithMessage(string ProceduerName, string[,] paramvalue, bool AddOutputparameter);
    }
}
