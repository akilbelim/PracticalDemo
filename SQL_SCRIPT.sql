USE [master]
GO
/****** Object:  Database [CsProjDB]    Script Date: 4/18/2022 5:35:06 PM ******/
CREATE DATABASE [CsProjDB]

USE [CsProjDB]
GO
/****** Object:  Table [dbo].[UserMasterNew]    Script Date: 4/18/2022 5:35:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserMasterNew](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](25) NULL,
	[LastNamme] [nvarchar](25) NULL,
	[EmailId] [nvarchar](25) NULL,
	[UserAddress] [nvarchar](max) NULL,
	[DateofBirth] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  UserDefinedFunction [dbo].[SplitString]    Script Date: 4/18/2022 5:35:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[SplitString]
(
    @String NVARCHAR(4000),
    @Delimiter NCHAR(1)
)
RETURNS TABLE
AS
RETURN
(
    WITH Split(stpos,endpos)
    AS(
        SELECT 0 AS stpos, CHARINDEX(@Delimiter,@String) AS endpos
        UNION ALL
        SELECT endpos+1, CHARINDEX(@Delimiter,@String,endpos+1)
            FROM Split
            WHERE endpos > 0
    )
    SELECT 'Id' = ROW_NUMBER() OVER (ORDER BY (SELECT 1)),
        'Value' = SUBSTRING(@String,stpos,COALESCE(NULLIF(endpos,0),LEN(@String)+1)-stpos)
    FROM Split
)

GO
SET IDENTITY_INSERT [dbo].[UserMasterNew] ON 

GO
INSERT [dbo].[UserMasterNew] ([UserID], [FirstName], [LastNamme], [EmailId], [UserAddress], [DateofBirth]) VALUES (2, N'sdf', N'sdf', N'sdf', N'sdf', CAST(N'2022-04-19 00:00:00.000' AS DateTime))
GO
INSERT [dbo].[UserMasterNew] ([UserID], [FirstName], [LastNamme], [EmailId], [UserAddress], [DateofBirth]) VALUES (3, N'Testss', N'test', N'test@gmail.com', N'Rajkot', CAST(N'1989-02-12 00:00:00.000' AS DateTime))
GO
INSERT [dbo].[UserMasterNew] ([UserID], [FirstName], [LastNamme], [EmailId], [UserAddress], [DateofBirth]) VALUES (4, N'Tes', N'Best', N'test@gmail.com', N'Rajkot', CAST(N'1989-02-12 00:00:00.000' AS DateTime))
GO
INSERT [dbo].[UserMasterNew] ([UserID], [FirstName], [LastNamme], [EmailId], [UserAddress], [DateofBirth]) VALUES (5, N'Tests', N'Best', N'test@gmail.com', N'Rajkot', CAST(N'1989-02-12 00:00:00.000' AS DateTime))
GO
INSERT [dbo].[UserMasterNew] ([UserID], [FirstName], [LastNamme], [EmailId], [UserAddress], [DateofBirth]) VALUES (6, N'asd', N'asd', N'test@gmail.com', N'asdasd', CAST(N'1989-02-12 00:00:00.000' AS DateTime))
GO
INSERT [dbo].[UserMasterNew] ([UserID], [FirstName], [LastNamme], [EmailId], [UserAddress], [DateofBirth]) VALUES (7, N'ewrwer', N'Best', N'test@gmail.com', N'Rajkot', CAST(N'1989-02-12 00:00:00.000' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[UserMasterNew] OFF
GO
/****** Object:  StoredProcedure [dbo].[UserMasterNew_SP]    Script Date: 4/18/2022 5:35:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[UserMasterNew_SP]
	@UserID [int] = null,
    @FirstName [nvarchar](25) = null,
    @LastNamme [nvarchar](25) = null,
    @EmailId [nvarchar](25) = null,
    @UserAddress [nvarchar](max) = null,
    @DateofBirth [datetime] = null,
    @QueryID [int] = null,
    @Offset [int] = null,
    @Limit [int] = null,
    @SortColumn [nvarchar](50) = null,
    @SearchText [nvarchar](50) = null,
    @OUTVAL [int] OUT,
    @OUTMESSAGE [nvarchar](200) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON
    	SET @OUTVAL= 0 
    	SET @OUTMESSAGE= 'SOMTHING WENT WRONG.' 

    -- Insert statements for procedure here
	    	if(@QueryID = 0)
    	BEGIN
    		IF(@UserID = 0)
    		BEGIN
				DECLARE @SortOrder varchar(50) = null;
				DECLARE @SortColm varchar(50) = null;
			
				SET @SortColm = (SELECT TOP 1 Value FROM DBO.SplitString(@SortColumn,' '));
				SET @SortOrder = (SELECT Value FROM DBO.SplitString(@SortColumn,' ') ORDER BY Id OFFSET 1 ROWS FETCH NEXT 2 ROWS ONLY);

    			SELECT UserID,FirstName,LastNamme,EmailId,UserAddress,DateofBirth FROM UserMasterNew    			
    			WHERE FirstName LIKE '%'+@SearchText+'%' OR LastNamme LIKE '%'+@SearchText+'%' 
				ORDER BY case 
				when @SortOrder <> 'ASC' then 0
				when @SortColm = 'UserID' then UserID
				end ASC
				,case
				when @SortOrder <> 'ASC' then ''
				when @SortColm = 'FirstName' then FirstName
				end ASC
				,case
				when @SortOrder <> 'ASC' then ''
				when @SortColm = 'LastNamme' then LastNamme
				end ASC
				,case
				when @SortOrder <> 'ASC' then ''
				when @SortColm = 'EmailId' then EmailId
				end ASC
				,case
				when @SortOrder <> 'ASC' then ''
				when @SortColm = 'DateofBirth' then DateofBirth
				end ASC
				,case
				when @SortOrder <> 'DESC' then 0
				when @SortColm = 'UserID' then UserID
				end DESC
				,case
				when @SortOrder <> 'DESC' then ''
				when @SortColm = 'FirstName' then FirstName
				end DESC
				,case
				when @SortOrder <> 'DESC' then ''
				when @SortColm = 'EmailId' then EmailId
				end DESC
				,case
				when @SortOrder <> 'DESC' then ''
				when @SortColm = 'DateofBirth' then DateofBirth
				end DESC
				,case
				when @SortOrder <> 'DESC' then ''
				when @SortColm = 'LastNamme' then LastNamme
				end DESC
				OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY;
    			
    			SET @OUTVAL= (SELECT COUNT(UserID) from UserMasterNew)
    			SET @OUTMESSAGE= 'data found...!' 
    		END
    		ELSE
    		BEGIN
    			SELECT TOP 1 UserID,FirstName,LastNamme,EmailId,UserAddress,DateofBirth FROM UserMasterNew
    			WHERE UserID=@UserID
    		END
    	END
    	--INSERT CityMaster
    	ELSE IF(@QueryID = 1)
    	BEGIN
    		IF((SELECT COUNT(UserID) FROM UserMasterNew WHERE FirstName = @FirstName)>0)
    		BEGIN
    			SET @OUTVAL=0
    			SET @OUTMESSAGE='Duplicate records found...!'
    		END
    		ELSE
    		BEGIN
    			INSERT INTO UserMasterNew (FirstName,LastNamme,EmailId,UserAddress,DateofBirth) 
    			VALUES(@FirstName,@LastNamme,@EmailId,@UserAddress,@DateofBirth)
    			SET @OUTVAL=SCOPE_IDENTITY()
    			SET @OUTMESSAGE='Records inserted successfully...!'
    		END
    	END
    	--UPDATE CityMaster
    	ELSE IF(@QueryID = 2)
    	BEGIN
    		IF((SELECT Count(UserID) AS TotalRec FROM UserMasterNew WHERE FirstName = @FirstName OR UserID = @UserID)>1)
    		BEGIN
    			SET @OUTVAL=0
    			SET @OUTMESSAGE='Duplicate records found...!'
    		END
    		ELSE
    		BEGIN
    			UPDATE UserMasterNew SET FirstName=@FirstName,LastNamme=@LastNamme,EmailId=@EmailId,
				UserAddress=@UserAddress,DateofBirth=@DateofBirth
    			WHERE UserID=@UserID
    			SET @OUTVAL=1
    			SET @OUTMESSAGE='Records updated successfully...!'
    		END
    	END
    	ELSE IF(@QueryID = 3)
    	BEGIN
    		DELETE FROM UserMasterNew WHERE UserID=@UserID
    		SET @OUTVAL=1
    		SET @OUTMESSAGE='Records ss deleted successfully...!'
    	END
END

GO
USE [master]
GO
ALTER DATABASE [CsProjDB] SET  READ_WRITE 
GO
