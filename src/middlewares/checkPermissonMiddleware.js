const logger = require('../config/logger');
const { Role, Permission, UserRole } = require('../models');

const checkPermisson = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const userRole = await UserRole.findAll({
            where: {userId}, 
            include: [
                {
                    model: Role, 
                    include:[
                        {   
                            model: Permission,
                            throw: {attributes:[]}
                        }
                    ]
                }
            ]
        });
        
        if (!userRole) {
            logger.warn('Role Not Found!', { roleId: userRole.id, userId: req.user.id });
            return res.status(403).json({ error: 'Role not found' });
        }

        const role_permissions = userRole.flatMap(userRoleItem => 
            userRoleItem.Role?.Permissions?.map(p => ({
                http_method: p.http_method,
                route: p.route
            })) || []
        );


        const currentRoute = req.originalUrl;
        const currentMethod = req.method;
        // console.log(currentRoute);
        // console.log(currentMethod);
    
        const convertRouteToRegex = (route) => {
            // Replace ":param" with a regex pattern that matches any segment
            const regexString = route.replace(/:[^\/]+/g, '([^/]+)');
            // Return the regex object with start and end boundaries
            return new RegExp(`^${regexString}$`);
        };
    
        const hasPermission = role_permissions.some(permission => {            
            const routeRegex = convertRouteToRegex(permission.route);
            return routeRegex.test(currentRoute) && permission.http_method === currentMethod;
        });
        

        if(req.is_super_user == 1){
            if (!hasPermission){
                logger.warn('Please add the route in permissions table', {method: currentMethod, route: currentRoute});
            }
            return next();
        }
    
        if (!hasPermission || !userRole[0].Role?.status) {
            logger.warn('Access denied', {
                userId: req.user.id,
                role: userRole.name,
                method: currentMethod,
                route: currentRoute
            });
            return res.status(403).json({ error: 'Forbidden: You do not have permission for this action' });
        }

        next();
    } catch(error){
        logger.error('Permission middleware error', {
            error: error.message,
            stack: error.stack,
            userId: req.user?.id,
            route: req.originalUrl,
            method: req.method
        });
        return res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = checkPermisson;