using System;
 
public partial class UserMapper
{
    [MapProperty(nameof(UserSeederModel.Email), nameof(UserEntity.UserName))]
    public partial UserEntity RegisterModelToUser(RegisterModel model);
}
