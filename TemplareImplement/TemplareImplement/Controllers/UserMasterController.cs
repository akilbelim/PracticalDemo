using DataModels;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TemplareImplement.Models;
using TemplareImplement.Repository;

namespace TemplareImplement.Controllers
{
    public class UserMasterController : Controller
    {
        IUserMaster _UserMaster;
        public UserMasterController(IUserMaster container)
        {
            _UserMaster = container;
        }
        public IActionResult Index()
        {
            using (var db = new CsProjDBDB())
            {
                var q =
                    from c in db.UserMasterNews
                    select c;

                foreach (var c in q)
                    Console.WriteLine(c.FirstName);
            }
            return View();
        }
        public JsonResult GetDetails(string searchText = "", int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            MEMBERS.SQLReturnValue _RetVal = new MEMBERS.SQLReturnValue();
            UserMasterMdl _UserMasterMdl = null;
            try
            {
                using (var db = new CsProjDBDB())
                {
                    var q = from c in db.UserMasterNews.
                            Skip((jtStartIndex - 1) * jtPageSize).Take(jtPageSize)
                            where c.FirstName == searchText && c.LastNamme == searchText
                            select new
                            {
                                c.FirstName,
                                c.LastNamme,
                                c.UserAddress,
                                c.EmailId,
                                c.DateofBirth
                            };

                    foreach (var c in q)
                        Console.WriteLine(c.FirstName);
                }
                _UserMasterMdl = new UserMasterMdl();
                _UserMasterMdl.UserID = "0";
                _UserMasterMdl.QueryID = "0";
                _UserMasterMdl.Offset = jtStartIndex.ToString();
                _UserMasterMdl.Limit = jtPageSize.ToString();
                _UserMasterMdl.SortColumn = jtSorting == null ? "" : jtSorting.ToString();
                _UserMasterMdl.SearchText = searchText == null ? "" : searchText;
                _RetVal = _UserMaster.GetUserMasterDataWithPaging(_UserMasterMdl);
                if (_RetVal.Outval != 0)
                {
                    List<UserMasterMdl> _LstCityModel = new List<UserMasterMdl>();
                    if (_RetVal.RetDatatable.Rows.Count > 0)
                    {
                        for (int i = 0; i < _RetVal.RetDatatable.Rows.Count; i++)
                        {
                            UserMasterMdl _UserMaster = new UserMasterMdl();
                            _UserMaster.UserID = _RetVal.RetDatatable.Rows[i]["UserID"].ToString();
                            _UserMaster.FirstName = _RetVal.RetDatatable.Rows[i]["FirstName"].ToString();
                            _UserMaster.LastNamme = _RetVal.RetDatatable.Rows[i]["LastNamme"].ToString();
                            _UserMaster.UserAddress = _RetVal.RetDatatable.Rows[i]["UserAddress"].ToString();
                            _UserMaster.EmailId = _RetVal.RetDatatable.Rows[i]["EmailId"].ToString();
                            _UserMaster.DateofBirth = _RetVal.RetDatatable.Rows[i]["DateofBirth"].ToString();
                            _LstCityModel.Add(_UserMaster);
                        }
                    }
                    return Json(new { Result = "OK", Records = _LstCityModel, TotalRecordCount = _RetVal.Outval });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = _RetVal.OUTMESSAGE });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
            finally
            {
                if (_UserMasterMdl != null) { _UserMasterMdl = null; }
            }
        }

        [HttpPost]
        public JsonResult Create(UserMasterMdl Model)
        {
            MEMBERS.SQLReturnValue _RetVal = new MEMBERS.SQLReturnValue();
            UserMasterMdl _UserMasterMdl = null;
            try
            {
                if (ModelState.IsValid)
                {
                    _UserMasterMdl = new UserMasterMdl();
                    _UserMasterMdl.UserID = "0";
                    _UserMasterMdl.FirstName = Model.FirstName;
                    _UserMasterMdl.LastNamme = Model.LastNamme;
                    _UserMasterMdl.EmailId = Model.EmailId;
                    _UserMasterMdl.UserAddress = Model.UserAddress;
                    _UserMasterMdl.DateofBirth = Model.DateofBirth;
                    _UserMasterMdl.QueryID = "1";
                    _RetVal = _UserMaster.InsertUserMasterData(_UserMasterMdl);
                    if (_RetVal.Outval != 0)
                    {
                        //UserMasterMdl _CityModel = new UserMasterMdl();
                        //_CityModel.CityID = _RetVal.Outval.ToString();
                        //_CityModel.CityName = Model.CityName;
                        //_CityModel.StateID = _RetVal.Outval.ToString();
                        //_CityModel.StateName = Model.StateName;
                        //_CityModel.AirHours = Model.AirHours;
                        //_CityModel.SurfHours = Model.SurfHours;
                        //_CityModel.IsActive = "Active";
                        return Json(new { Result = "OK", Record = _UserMasterMdl });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = _RetVal.OUTMESSAGE });
                    }
                }
                else
                {
                    var message = string.Join(" | ", ModelState.Values
                       .SelectMany(v => v.Errors)
                       .Select(e => e.ErrorMessage));
                    return Json(new { Result = "ERROR", Message = message });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
            finally
            {
                if (_UserMasterMdl != null) { _UserMasterMdl = null; }
            }
        }
        [HttpPost]
        public JsonResult Edit(UserMasterMdl Model)
        {
            MEMBERS.SQLReturnValue _RetVal = new MEMBERS.SQLReturnValue();
            UserMasterMdl _UserMasterMdl = null;
            try
            {
                if (ModelState.IsValid)
                {
                    _UserMasterMdl = new UserMasterMdl();
                    _UserMasterMdl.UserID = Model.UserID;
                    _UserMasterMdl.FirstName = Model.FirstName;
                    _UserMasterMdl.LastNamme = Model.LastNamme;
                    _UserMasterMdl.EmailId = Model.EmailId;
                    _UserMasterMdl.UserAddress = Model.UserAddress;
                    _UserMasterMdl.DateofBirth = Model.DateofBirth;
                    _UserMasterMdl.QueryID = "2";
                    _RetVal = _UserMaster.InsertUserMasterData(_UserMasterMdl);
                    if (_RetVal.Outval != 0)
                    {
                        //UserMasterMdl _CityModel = new UserMasterMdl();
                        //_CityModel.UserID = Model.UserID;
                        //_CityModel.CityName = Model.CityName;
                        //_CityModel.StateID = Model.StateID.ToString();
                        //_CityModel.StateName = Model.StateName;
                        //_CityModel.AirHours = Model.AirHours;
                        //_CityModel.SurfHours = Model.SurfHours;
                        //_CityModel.IsActive = "Active";
                        return Json(new { Result = "OK", Record = _UserMasterMdl });
                    }
                    else
                    {
                        return Json(new { Result = "ERROR", Message = _RetVal.OUTMESSAGE });
                    }
                }
                else
                {
                    var message = string.Join(" | ", ModelState.Values
                       .SelectMany(v => v.Errors)
                       .Select(e => e.ErrorMessage));
                    return Json(new { Result = "ERROR", Message = message });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
            finally
            {
                if (_UserMasterMdl != null) { _UserMasterMdl = null; }
            }
        }
        [HttpPost]
        public JsonResult Delete(String UserID)
        {
            MEMBERS.SQLReturnValue _RetVal = new MEMBERS.SQLReturnValue();
            UserMasterMdl _UserMasterMdl = null;
            try
            {
                _UserMasterMdl = new UserMasterMdl();
                _UserMasterMdl.UserID = UserID;
                _UserMasterMdl.QueryID = "3";
                _RetVal = _UserMaster.DeleteUserMasterData(_UserMasterMdl);
                if (_RetVal.Outval != 0)
                {
                    return Json(new { Result = "OK" });
                }
                else
                {
                    return Json(new { Result = "ERROR", Message = _RetVal.OUTMESSAGE });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", Message = ex.Message });
            }
            finally
            {
                if (_UserMasterMdl != null) { _UserMasterMdl = null; }
            }
        }
    }
}
