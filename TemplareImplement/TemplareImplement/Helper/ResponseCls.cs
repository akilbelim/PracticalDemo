using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CSProj.Helper
{
    public class ResponseCls
    {
        public bool status { get; set; }
        public string message { get; set; }
        public object data { get; set; }
    }
    public class dataObj
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

}