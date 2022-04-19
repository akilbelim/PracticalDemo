using System.Data;

/// <summary>
/// Summary description for MEMBERS
/// </summary>
public class MEMBERS
{
    public struct SQLReturnValue
    {
        public int Outval { get; set; }
        public string OUTMESSAGE { get; set; }
        public DataTable RetDatatable;
    }

    public static string GetDateFormatProper(string Date)
    {
        //string DataFormatRet = string.Empty;
        string WholeString = string.Empty;
        if (Date.Contains("/"))
        {
            string[] SplitString = Date.Split('/');
            WholeString = SplitString[1] + "/" + SplitString[0] + "/" + SplitString[2];
        }
        else
        {
            string[] SplitString = Date.Split('-');
            WholeString = SplitString[1] + "-" + SplitString[0] + "-" + SplitString[2];
        }
        //DataFormatRet = Convert.ToDateTime(Date).ToString("dd/MM/yyy hh:mm:ss");
        return WholeString;
    }
}